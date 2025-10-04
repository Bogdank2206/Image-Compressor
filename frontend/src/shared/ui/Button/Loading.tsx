import React from 'react';
import {Box, CircularProgress} from "@mui/material";

export function Loading(): React.JSX.Element {
    return (
        <Box display="flex" justifyContent="center" alignItems="center">
            <CircularProgress/>
        </Box>
    );
}