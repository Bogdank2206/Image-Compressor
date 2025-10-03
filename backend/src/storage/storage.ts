import config from "../config";
import {FileRequest} from "../types/FileRequest";
import multer, {Multer, StorageEngine} from "multer";
import fs from "fs";
import * as path from "node:path";
import hashString from "../lib/hasString";


function validateSessionId(req: FileRequest): string {
    const sessionId: string | string[] | undefined = req.headers['x-folder'];
    if (typeof sessionId !== "string") {
        throw Error("Folder is not a string");
    }
    return sessionId;
}

const storage: StorageEngine = multer.diskStorage({
    destination(req: FileRequest, file, cb) {
        const uploadDir = `${config.ROOT_DIR}/public/`;
        const {folder} = req.params;
        const folderHash: string = hashString(folder);
        const uploadPath: string = path.join(uploadDir, folderHash, `source`);

        req.folderHash = folderHash;

        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, {recursive: true});
        }
        cb(null, uploadPath);
    },
    filename(req: FileRequest, file, cb) {
        const {name, ext} = path.parse(file.originalname);
        req.originalName = file.originalname;
        const filename: string = `${hashString(name)}${ext}`;
        cb(null, filename);
    },
});

const fileManager: Multer = multer({storage});

export default fileManager;