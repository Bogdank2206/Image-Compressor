import {Request} from "express";

export interface FileRequest extends Request {
    file?: Express.Multer.File;
    format?: 'webp' | 'jpg';
    quality?: string;
    rows?: number;
    cols?: number;
    folderHash?: string;
    originalName?: string;
}