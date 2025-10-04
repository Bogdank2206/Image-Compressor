import {AppBar, Box, IconButton, Toolbar, Typography} from '@mui/material';
import ArtTrackIcon from '@mui/icons-material/ArtTrack';
import React from 'react';
import Link from 'next/link';

export function NavBar(): React.JSX.Element {
    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="static">
                <Toolbar sx={{paddingY: 1}}>
                    <IconButton
                        size="large"
                        color="inherit"
                        sx={{
                            mr: 2,
                            '&:hover': {backgroundColor: 'transparent'},
                            '&.Mui-focusVisible': {outline: 'none'},
                        }}
                        component={Link}
                        href="/"
                    >
                        <ArtTrackIcon sx={{fontSize: 48, margin: 0, padding: 0}}/>
                    </IconButton>

                    <Typography
                        variant="h3"
                        component={Link}
                        href="/"
                        sx={{
                            flexGrow: 1,
                            fontWeight: 800,
                            fontSize: 40,
                            textDecoration: 'none',
                            color: 'inherit',
                        }}
                    >
                        MIEM Compressor
                    </Typography>
                </Toolbar>
            </AppBar>
        </Box>
    );
}