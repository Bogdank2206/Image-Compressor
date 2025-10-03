import {exec} from "node:child_process";
import * as util from "node:util";
import path from "node:path";
import fs from "fs";
import {promisify} from "node:util";

const execPromise = util.promisify(exec);

export type errorZone = {
    y: number;
    x: number;
    err: number;
}

class CompareService {
    private readonly rows: number;
    private readonly cols: number;
    private readonly pathToSource: string;
    private readonly pathToCompressed: string;

    public constructor(workDir: string, source: string, compressed: string, rows: number, cols: number) {
        this.rows = rows;
        this.cols = cols;
        this.pathToSource = path.join(workDir, "source", source);
        this.pathToCompressed = path.join(workDir, "compressed", compressed);
    }

    public async compareFiles(): Promise<errorZone & { diff: number }> {
        const {width, height} = await this.getImageDimensions(this.pathToSource);
        const sizeX: number = Math.floor(width / this.rows);
        const sizeY: number = Math.floor(height / this.cols);

        const promises: Promise<errorZone>[] = Array.from({length: this.cols * this.rows}, async (_, idx: number) => {
            const x: number = idx % this.cols;
            const y: number = Math.floor(idx / this.cols);
            const err: number = await this.analyzeZone(x, y, sizeX, sizeY);
            return ({x, y, err});
        });

        const results: errorZone[] = await Promise.all(promises);
        const noisyZone: errorZone = results.reduce(
            (max: errorZone, el: errorZone) => (el.err > max.err) ? el : max,
            {x: -1, y: -1, err: -1}
        );

        const {stdout: diff} = await execPromise(
            `magick identify -format "Image1: %wx%h\\nImage2: %wx%h\\n" ${this.pathToSource} ${this.pathToCompressed}`
        )

        const statPromise = promisify(fs.stat);

        const {size: sourceSize} = await statPromise(this.pathToSource);
        const {size: compressedSize} = await statPromise(this.pathToCompressed);

        return {...noisyZone, diff: Math.abs(sourceSize - compressedSize)};
    }

    private async analyzeZone(zoneX: number, zoneY: number, sizeX: number, sizeY: number): Promise<number> {
        const startX: number = zoneX * sizeX;
        const startY: number = zoneY * sizeY;

        let result;
        try {
            const {stdout} = await execPromise(
                `magick compare -metric MSE ` +
                `${this.pathToSource} -crop ${sizeX}x${sizeY}+${startX}+${startY} ` +
                `${this.pathToCompressed} -crop ${sizeX}x${sizeY}+${startX}+${startY} null: 2>&1`
            )
            result = stdout;
        } catch (err: any) {
            if (err.stdout) {
                result = err.stdout.toString();
            } else {
                console.log(err);
                return -1;
            }
        }
        const match = result.match(/(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : -1;
    }

    private async getImageDimensions(imagePath: string) {
        try {
            const {stdout: result} = await execPromise(`magick identify -format "%wx%h" "${imagePath}"`, {encoding: 'utf8'});
            const [width, height] = result.split('x').map(Number);
            return {width, height};
        } catch (error) {
            return {width: 0, height: 0};
        }
    }
}

export default CompareService;