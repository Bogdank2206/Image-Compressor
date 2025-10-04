import { instance } from "@/shared/api/instance";
import { Metadata } from "@/app/providers";

type response = {
    pageCreators?: (() => Promise<Metadata>)[];
    code: number;
    message: string;
};

export function getCompressedImages(
    files: FileList | undefined | null,
    quality: number,
    format: string,
    rows: number,
    cols: number,
    folder: string
): response {
    if (typeof files === "undefined" || files === null) {
        return { code: 1, message: "Загрузите папку" };
    }
    const promises: File[] = Array.from(files);
    if (promises.length === 0) {
        return { code: 1, message: "Загрузите папку" };
    }

    const pageCreators = Array.from(files).map(
        (file: File) => async (): Promise<Metadata> => {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("quality", quality.toString());
            formData.append("rows", rows.toString());
            formData.append("cols", cols.toString());
            formData.append("format", format);

            const response = await instance.post(`/${folder}`, formData, {
                headers: { "Content-Type": "multipart/form-data" },
            });
            return response.data;
        }
    );

    return { pageCreators, code: 0, message: "Файлы успешно обработаны" };
}
