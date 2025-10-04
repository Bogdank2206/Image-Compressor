import React from 'react';
import {Metadata, useImages} from "@/app/providers";

export interface PropsWithImages {
    images: Metadata[];
}

export function withImagesVisible(
    Component: React.ComponentType<PropsWithImages>
): React.FC {
    return function WrappedComponent() {
        const images: Metadata[] = useImages();

        if (images.length === 0) {
            return null;
        }
        return <Component images={images}/>;
    };
}