'use client'

import React, {Suspense, useState} from "react";
import MUIButton from '@mui/material/Button';
import {Loading} from "@/shared/ui";

interface Props {
    color?: 'inherit' | 'primary' | 'secondary' | 'success' | 'error' | 'info' | 'warning';
    size?: 'small' | 'medium' | 'large';
    children: string;
    onClick?: () => Promise<void>;
}

export function Button({children, size = 'medium', color = 'primary', onClick}: Props): React.JSX.Element {
    const [disabled, setDisabled] = useState<boolean>(false);

    async function handleClick(): Promise<void> {
        try {
            setDisabled(true);
            await onClick?.();
        } catch (err) {
            console.error(err);
        } finally {
            setDisabled(false);
        }
    }

    return (
        <Suspense fallback={<Loading/>}>
            <MUIButton variant="contained" size={size} color={color}
                       disabled={disabled} onClick={handleClick}
            >
                {children}
            </MUIButton>
        </Suspense>
    );
}