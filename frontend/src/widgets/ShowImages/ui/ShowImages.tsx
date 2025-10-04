'use client'

import {JSX} from "react";
import {PropsWithImages, withImagesVisible} from "@/widgets/ShowImages/lib/withImages";
import {Metadata} from "@/app/providers";
import {Image} from "@/widgets/ShowImages/ui/Image";
import {Box} from "@mui/material";

function ShowingImages({images}: PropsWithImages): JSX.Element {
    return (
        <Box sx={{display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
            <div>
                {images.map((image: Metadata, idx: number) => (
                        <Image key={`image_${idx}`} {...image}/>
                    )
                )}
            </div>
        </Box>
    )
}

export const ShowImages = withImagesVisible(ShowingImages);