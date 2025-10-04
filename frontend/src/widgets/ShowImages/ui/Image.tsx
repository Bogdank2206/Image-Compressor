'use client'

import {JSX, RefObject, useEffect, useRef} from "react";
import {Metadata} from "@/app/providers";

export function Image({imagePath, zoneX, zoneY, originalName, rows, cols, diff, err}: Metadata): JSX.Element {
    const imageContainer: RefObject<HTMLDivElement | null> = useRef<HTMLDivElement | null>(null);
    const imgRef: RefObject<HTMLImageElement | null> = useRef<HTMLImageElement | null>(null);

    function handleResize() {
        if (imageContainer === null || imageContainer.current === null) {
            return;
        }
        if (imgRef === null || imgRef.current === null) {
            return;
        }

        const imgWidth: number = imgRef.current.naturalWidth;
        const imgHeight: number = imgRef.current.naturalHeight;

        let finalWidth: number = imgWidth;
        let finalHeight: number = imgHeight;

        if (imgWidth === 0 || imgHeight === 0) {
            finalWidth = 400;
            finalHeight = 300;
        }

        const maxWidth: number = window.innerWidth * 0.8;
        const maxHeight: number = window.innerHeight * 0.7;
        if (imgWidth > maxWidth || imgHeight > maxHeight) {
            const ratio: number = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
            finalWidth = imgWidth * ratio;
            finalHeight = imgHeight * ratio;
        }

        const minWidth: number = window.innerWidth * 0.8;
        const minHeight: number = window.innerHeight * 0.7;
        if (finalWidth < minWidth || finalHeight < minHeight) {
            const ratio: number = Math.min(
                minWidth / finalWidth,
                minHeight / finalHeight
            );
            finalWidth *= ratio;
            finalHeight *= ratio;
        }

        imageContainer.current.style.width = finalWidth + "px";
        imageContainer.current.style.height = finalHeight + "px";
        imageContainer.current.style.aspectRatio = `${imgWidth}/${imgHeight}`;
    }

    useEffect(() => {
        setTimeout(handleResize, 10000);
    }, []);

    const styles = {
        left: `${zoneX / cols * 100}%`,
        top: `${zoneY / rows * 100}%`,
        width: `${1 / cols * 100}%`,
        height: `${1 / rows * 100}%`,
    }

    return (
        <div className="container">
            <div ref={imageContainer} className="image__container">
                <img
                    ref={imgRef}
                    className="img"
                    src={imagePath}
                    alt="image"
                    onLoad={handleResize}
                />
                <div
                    className="border"
                    style={styles}
                ></div>
            </div>
            <div className="data">
                <h3>
                    {originalName}
                </h3>
                <p>Coordinates of noisy zone: ({zoneX}, {zoneY})
                </p>
                <p>Mean squared error: {err}</p>
                <p>size difference: {diff}</p>
            </div>
        </div>

    )
}