import express, { Express, Response } from "express";
import { FileRequest } from "../types/FileRequest";
import fileManager from "../storage/storage";
import { Request } from "express";
import { NextFunction } from "express";
import * as path from "node:path";
import FileFormats from "../types/FileFormats";
import FileService from "./service/FileService";
import CompareService from "./service/CompareService";
import fs from "fs";
import { promisify } from "node:util";
import config from "../config";
import hashString from "../lib/hasString";
import cors from "cors";

const app: Express = express();

const { SRC_DIR, ROOT_DIR, API_LINK } = config;

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.set("views", path.join(SRC_DIR, "templates"));
app.use("/", express.static(path.join(ROOT_DIR, "public")));

type Metadata = {
    zoneX: number;
    zoneY: number;
    err: number;
    rows: number;
    cols: number;
    originalName: string;
    diff: string;
};

app.post(
    "/:folder",
    fileManager.single("file"),
    async (req: FileRequest, res: Response) => {
        console.log("New Request to upload photo");

        if (!req.file) {
            return res
                .status(400)
                .json({ code: 1, message: "No file uploaded" });
        }
        if (typeof req.originalName === "undefined") {
            return res.status(500).json({ code: 1, message: "No name sent" });
        }

        const { destination, filename } = req.file;

        const quality: string = req.body?.quality || "85";
        const qualityNumber: number = Number(quality);
        if (isNaN(qualityNumber) || qualityNumber < 0 || qualityNumber > 100) {
            return res.status(400).json({
                code: 1,
                message:
                    "Invalid quality value. Must be number between 0 and 100.",
            });
        }

        const format: FileFormats = req.body?.format || "jpg";
        if (!["webp", "jpg"].includes(format)) {
            return res.status(400).json({
                code: 1,
                message:
                    "Invalid quality value. Must be number 'webp' or 'jpg'",
            });
        }

        const rows: number = req.body?.rows || 8;
        const cols: number = req.body?.cols || 8;

        const workDir: string = path.dirname(destination);

        const { code, compressedFilename } = await FileService.compressFile(
            workDir,
            filename,
            quality,
            format
        );
        if (code === 1 || typeof compressedFilename === "undefined") {
            return res.status(500).json({ code, message: "Something broke!" });
        }

        const compareService = new CompareService(
            workDir,
            filename,
            compressedFilename,
            rows,
            cols
        );
        const {
            x: zoneX,
            y: zoneY,
            err,
            diff,
        } = await compareService.compareFiles();
        const { originalName } = req;

        const sizes: string[] = ["B", "KB", "MB"];
        let i: number;
        let diffNumber: number = diff;
        for (
            i = 0;
            i < sizes.length && diffNumber >= 1024;
            i++, diffNumber /= 1024
        ) {}

        const metadata: Metadata = {
            zoneX,
            zoneY,
            err,
            rows,
            cols,
            originalName,
            diff: `${diffNumber.toFixed(2)}${sizes[i]}`,
        };

        const { folderHash } = req;

        await promisify(fs.appendFile)(
            path.join(workDir, "files.txt"),
            `${API_LINK}/${folderHash}/compressed/${compressedFilename};${JSON.stringify(
                metadata
            )}\n`
        );

        return res.status(200).json({
            imagePath: `${API_LINK}/${folderHash}/compressed/${compressedFilename}`,
            ...metadata,
        });
    }
);

app.get("/get-html/:folder", (req: Request, res: Response) => {
    console.log("New Request to get html");

    const { folder } = req.params;
    if (typeof folder === "undefined") {
        return res.status(404).json({ code: 1, message: "Folder not sent" });
    }
    const folderHash: string = hashString(folder);
    if (!fs.existsSync(path.join("public", folderHash))) {
        return res.status(404).json({ code: 1, message: "Folder not found" });
    }

    let images: ({ imagePath: string } & Metadata)[];
    try {
        const content: string = fs.readFileSync(
            path.join("public", folderHash, "files.txt"),
            "utf8"
        );
        const lines: string[] = content.split("\n");

        images = lines.slice(0, lines.length - 1).map((line: string) => {
            const [imagePath, metadata] = line.split(";");
            const parsedMetadata: Metadata = JSON.parse(metadata);
            return { imagePath, ...parsedMetadata };
        });
    } catch (error) {
        console.error("Error reading file:", error);
        return res.status(500).json({ code: 1, message: "Cannot read file" });
    }

    res.status(200).render("images", {
        images,
        faviconLink: `${API_LINK}/favicon.ico`,
        stylesLink: `${API_LINK}/styles`,
    });
});

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.log(err);
    return res.status(500).json({ code: 1, message: "Something broke!" });
});

export default app;
