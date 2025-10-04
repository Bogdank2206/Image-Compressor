'use client';

import {Context, createContext} from "react";

export type Metadata = {
    imagePath: string;
    zoneX: number;
    zoneY: number;
    err: number;
    rows: number;
    cols: number;
    originalName: string;
    diff: string;
};

export const ImagesContext: Context<Metadata[] | undefined> = createContext<Metadata[] | undefined>(undefined);

export type pushImage = (value: Metadata) => void;

export const PushImageContext: Context<pushImage | undefined> = createContext<pushImage | undefined>(undefined);