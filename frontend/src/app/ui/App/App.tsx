import React from 'react';
import {NavBar} from "@/shared/ui";
import {CompressForm} from "@/features/CompressForm";
import {ImagesProvider} from "@/app/providers";
import {FolderProvider} from "@/app/providers/FolderContext/FolderProvider";
import {ShowImages} from "@/widgets/ShowImages";

export function App(): React.ReactNode {
    return (
        <>
            <NavBar/>
            <FolderProvider>
                <ImagesProvider>
                    <CompressForm/>
                    <ShowImages/>
                </ImagesProvider>
            </FolderProvider>
        </>
    );
}