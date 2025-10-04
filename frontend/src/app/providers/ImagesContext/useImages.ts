import {useContext} from "react";
import {ImagesContext, Metadata, pushImage, PushImageContext} from "@/app/providers/ImagesContext/ImagesContext";

export function useImages(): Metadata[] {
    const images: Metadata[] | undefined = useContext(ImagesContext);
    if (typeof images === "undefined") {
        throw new Error("images is undefined");
    }
    return images;
}

export function usePushImage(): pushImage {
    const pushImage: pushImage | undefined = useContext(PushImageContext);
    if (typeof pushImage === "undefined") {
        throw new Error("pushImage function is undefined");
    }
    return pushImage;
}