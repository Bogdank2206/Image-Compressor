import path from "node:path";
import { Sema } from "async-sema";
import * as util from "node:util";
import { execFile } from "node:child_process";

export const sema = new Sema(8);

export const execPromise = util.promisify(execFile);

export default {
    PROTOCOL: process.env.NODE_ENV === "production" ? "https" : "http",
    PORT: (process.env.PORT || 5000) as number,
    HOST: process.env.HOST || "localhost",
    ROOT_DIR: (process.env.ROOT_DIR || path.dirname(__dirname)) as string,
    SRC_DIR: (process.env.SRC_DIR || __dirname) as string,
    API_LINK: (process.env.API_LINK || "http://localhost:5000") as string,
};
