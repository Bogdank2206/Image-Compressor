'use client';

import React, {useState} from 'react';
import {ImagesContext, Metadata, PushImageContext} from "@/app/providers/ImagesContext/ImagesContext";

interface Props {
    children?: React.ReactNode;
}

export function ImagesProvider({children}: Props): React.JSX.Element {
    const [images, setImages] = useState<Metadata[]>([]);

    function pushImage(image: Metadata): void {
        setImages((prev: Metadata[]): Metadata[] => [...prev, image]);
    }

    return (
        <ImagesContext.Provider value={images}>
            <PushImageContext.Provider value={pushImage}>
                {children}
            </PushImageContext.Provider>
        </ImagesContext.Provider>
    )
}