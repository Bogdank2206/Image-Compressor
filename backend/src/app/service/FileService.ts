import { execPromise } from "../../config";
import FileFormats from "../../types/FileFormats";
import path from "node:path";
import fs from "fs";

class FileService {
    public async compressFile(
        workDir: string,
        filename: string,
        quality: string,
        format: FileFormats
    ) {
        const nameWithoutExt: string = path.parse(filename).name;
        const folderOfCompressed: string = path.join(workDir, "compressed");

        fs.mkdirSync(folderOfCompressed, { recursive: true });

        const pathToFile: string = path.join(workDir, "source", filename);
        const compressedFilename: string = `${nameWithoutExt}.${format}`;
        const pathToCompressed: string = path.join(
            folderOfCompressed,
            compressedFilename
        );

        try {
            await execPromise("magick", [
                pathToFile,
                "-quality",
                quality,
                pathToCompressed,
            ]);
            return { code: 0, compressedFilename };
        } catch (err) {
            console.log(err);
            return { code: 1 };
        }
    }
}

export default new FileService();
