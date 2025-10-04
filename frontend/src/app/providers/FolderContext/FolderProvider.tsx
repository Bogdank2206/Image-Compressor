'use client';

import React, {useState} from 'react';
import {FolderContext} from "@/app/providers/FolderContext/FolderContext";

interface Props {
    children?: React.ReactNode;
}

export function FolderProvider({children}: Props): React.JSX.Element {
    const [folder] = useState<string>(crypto.randomUUID());

    return (
        <FolderContext.Provider value={folder}>
            {children}
        </FolderContext.Provider>
    )
}