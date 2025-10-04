'use client';

import {Context, createContext} from "react";

export const FolderContext: Context<string | undefined> = createContext<string | undefined>(undefined);