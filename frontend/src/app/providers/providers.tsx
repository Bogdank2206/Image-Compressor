'use client';

import React from "react";
import {ThemeProvider, createTheme, Theme} from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {AppRouterCacheProvider} from '@mui/material-nextjs/v14-appRouter';

const theme: Theme = createTheme({
    typography: {
        fontFamily: 'Roboto, sans-serif',
    },
    palette: {
        mode: 'light',
    },
});

export function Providers({children}: { children: React.ReactNode }) {
    return (
        <AppRouterCacheProvider>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                {children}
            </ThemeProvider>
        </AppRouterCacheProvider>
    );
}