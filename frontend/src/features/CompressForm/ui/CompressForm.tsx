'use client';

import {Box, Button, RadioGroup, Radio, FormControlLabel, TextField} from '@mui/material';
import {ChangeEvent, KeyboardEvent, RefObject, useRef, useState} from 'react';
import {getCompressedImages} from "@/features/CompressForm/api/getCompressedImages";
import {Metadata, pushImage, useFolder, usePushImage} from "@/app/providers";
import {Loading} from "@/shared/ui";
import {handleDownload} from "@/features/CompressForm/lib/handleDownload";

const styles = {
    p: 3, display: 'flex', flexDirection: 'column', gap: 2,
    alignItems: 'center', mx: 'auto', my: 2,
}

const buttonStyles = {
    textTransform: 'none', borderRadius: 1.5, px: 2, py: 1, borderColor: 'grey.400',
    '&:hover': {borderColor: 'primary.main', bgcolor: 'primary lighten(0.9)'},
}

export function CompressForm() {
    const [loading, setLoading] = useState<boolean>(false);
    const [loaded, setLoaded] = useState<boolean>(false);
    const [wait, setWait] = useState<number>(-1);

    const pushImage: pushImage = usePushImage();
    const [message, setMessage] = useState<string | null>(null);
    const folder: string = useFolder();
    const [format, setFormat] = useState<string>('webp');
    const [quality, setQuality] = useState<number>(80);
    const [rows, setRows] = useState<number>(8);
    const [cols, setCols] = useState<number>(8);
    const inputFolder: RefObject<HTMLInputElement | null> = useRef<HTMLInputElement>(null);

    function uploadFolder(node: HTMLInputElement) {
        inputFolder.current = node;
        if (node) {
            ['webkitdirectory', 'directory', 'mozdirectory'].forEach((attr: string) => {
                node.setAttribute(attr, '');
            });
        }
    }

    const link: string = `${process.env.NEXT_PUBLIC_API_LINK}/get-html/${folder}`;

    function changeQuality({target: {value}}: ChangeEvent<HTMLInputElement>): void {
        const quality: number = Number(value);
        if ((!isNaN(quality) && 0 <= quality && quality <= 100) || value === '') {
            setQuality(quality);
        }
    }

    function changeRows({target: {value}}: ChangeEvent<HTMLInputElement>): void {
        if (value === '') {
            setRows(1);
        } else {
            const rows: number = Number(value);
            if ((!isNaN(rows) && 1 <= rows && rows <= 16) || value === '') {
                setRows(rows);
            }
        }
    }

    function changeCols({target: {value}}: ChangeEvent<HTMLInputElement>): void {
        if (value === '') {
            setCols(1);
        } else {
            const cols: number = Number(value);
            if ((!isNaN(cols) && 1 <= cols && cols <= 16)) {
                setCols(cols);
            }
        }
    }

    function changeFormat({target: {value: format}}: ChangeEvent<HTMLInputElement>): void {
        setFormat(format);
    }

    async function submit() {
        setMessage("Идет обработка, пожалуйста, подождите...");
        setLoaded(false);
        setLoading(true);
        setWait(0);
        const intervalId = setInterval(() => setWait(wait => wait + 1), 1000);
        const {
            pageCreators, code, message
        } = getCompressedImages(inputFolder.current?.files, quality, format, rows, cols, folder);
        if (code === 1 || typeof pageCreators === 'undefined') {
            setMessage(message);
            setLoading(false);
            clearInterval(intervalId);
            setWait(-1);
            return;
        }
        try {
            const promises = pageCreators.map(async (creator: () => Promise<Metadata>) => {
                const page = await creator();
                pushImage(page);
                return page;
            });

            await Promise.all(promises);
            setMessage("Файлы успешно обработаны");
            setLoaded(true);
        } catch (err) {
            console.error(err);
            setMessage("Ошибка обработки файлов");
        } finally {
            setWait(-1);
            clearInterval(intervalId);
            setLoading(false);
        }
    }

    function onEnter(event: KeyboardEvent<HTMLInputElement>): void {
        if (event.key === 'Enter') {
            submit();
        }
    }

    return (
        <Box sx={styles}>
            {loading || (
                <Button
                    variant="contained"
                    component="label"
                    sx={buttonStyles}
                >
                    Выберите папку
                    <input type="file" hidden ref={uploadFolder}/>
                </Button>
            )}

            <Box sx={{display: 'flex', flexDirection: 'row', maxWidth: '50%', alignItems: 'space-between', gap: 2}}>
                <TextField
                    fullWidth
                    label="Quality (0–100)"
                    variant="standard"
                    onKeyDown={onEnter}
                    value={quality}
                    onChange={changeQuality}
                    sx={{width: '33%'}}
                />
                <TextField
                    label="rows (1-16)"
                    variant="standard"
                    onKeyDown={onEnter}
                    value={rows}
                    onChange={changeRows}
                    sx={{width: '33%'}}
                />
                <TextField
                    label="cols (1-16)"
                    variant="standard"
                    onKeyDown={onEnter}
                    value={cols}
                    onChange={changeCols}
                    sx={{width: '33%'}}
                />
            </Box>
            <RadioGroup row value={format} onChange={changeFormat}>
                <FormControlLabel value="webp" control={<Radio size="small"/>} label="WebP"/>
                <FormControlLabel value="jpeg" control={<Radio size="small"/>} label="JPEG"/>
            </RadioGroup>

            {
                loading
                    ? <Loading/>
                    : (
                        <Button variant="contained" onClick={submit} disabled={loading}>
                            Сжать
                        </Button>
                    )
            }
            {
                message && <Box>{message}</Box>
            }
            {
                wait !== -1 && (
                    <Box>
                        {String(Math.floor(wait / 60)).padStart(2, '0')}:{String(wait % 60).padStart(2, '0')}s
                    </Box>
                )
            }
            {
                loaded && (
                    <Button variant="contained" onClick={() => handleDownload(link)}>
                        Скачать
                    </Button>
                )
            }
        </Box>
    )
}