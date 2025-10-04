import {FolderContext} from "@/app/providers/FolderContext/FolderContext";
import {useContext} from "react";

export function useFolder(): string {
    const folder: string | undefined = useContext(FolderContext);
    if (typeof folder === "undefined") {
        throw new Error("folder is undefined");
    }
    return folder;
}
