import crypto from "node:crypto";

export default function hashString(str: string) {
    return crypto
        .createHash('md5')
        .update(str)
        .digest('hex')
}