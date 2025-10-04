import React from 'react';
import {Metadata} from "next";
import {Providers} from "@/app/providers";
import "./styles.css";

export const metadata: Metadata = {
    title: 'MIEM Compressor',
    description: 'Image compressor for HSE',
}

interface Props {
    children: React.ReactNode
}

export default function RootLayout({children}: Props): React.ReactNode {
    return (
        <html lang="en">
        <body>
        <Providers>
            {children}
        </Providers>
        </body>
        </html>
    )
}
