import prompts from 'prompts';
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import exifr from 'exifr'
import shell from 'shelljs';
import { asyncExec } from 'async-shelljs'
import replace from 'replace-in-file';
import { Data } from './data';
import dayjs from 'dayjs';
const { replaceInFile } = replace;

type SortByFunc<T> = (s1: T, s2: T) => number;
enum SortByOrder {
    ASC = 1,
    DESC = -1,
}
const sortBy = <T = any>(
    arr: T[],
    $fn: SortByFunc<T> = (s1: any, s2: any) =>
        order * String(s1).localeCompare(String(s2)),
    order: SortByOrder = SortByOrder.ASC
) => {
    let fn = $fn;
    return [...arr].sort(fn);
};

async function getDate() {
    const response = await prompts({
        type: 'number',
        name: 'value',
        message: 'Enter date to convert'
    });

    return response.value;
}

// __dirname is not defined in ES module scope
const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);

const date = await getDate()
// const date = "20230510"
const workingDir = path.join(__dirname, `../../contents/${date}`);
const thumbnailDir = path.join(workingDir, "./thumbnail")
console.log(`working on ${workingDir}`);

const originalPictures = (await glob([path.join(workingDir, './original/*.*')]))
    .filter((item) => item.endsWith(".HEIC") || item.endsWith(".jpg") || item.endsWith(".JPG"));
const picturesPromises = originalPictures.sort().map(async (item) => {
    const targetOriginalFile = item.replace(".HEIC", ".avif").replace(".jpg", ".avif").replace(".JPG", ".avif");
    const fileName = path.basename(targetOriginalFile);

    let gpsOutput = null;
    let info = null;

    try {
        gpsOutput = await exifr.gps(item);
    } catch (e) {
    }

    try {
        info = await exifr.parse(item, ["LensModel", "LensMake", "DateTimeOriginal", "OffsetTimeOriginal", "Model", "Make"]);
    } catch (e) {
    }

    if (gpsOutput && gpsOutput.latitude != 0 && gpsOutput.longitude != 0 && !fs.existsSync(targetOriginalFile)) {
        await asyncExec(`convert ${item} ${targetOriginalFile}`);
    }

    const data = {
        original: `contents/${date}/original/${fileName}`,
        thumbnail: `contents/${date}/thumbnail/${fileName}`,
        desc: "",
        latitude: 0,
        longitude: 0,
        model: "",
        make: "",
        time: ""
    }

    if (gpsOutput && gpsOutput.latitude) data.latitude = gpsOutput.latitude
    if (gpsOutput && gpsOutput.longitude) data.longitude = gpsOutput.longitude
    if (info && info.LensMake) data.make = info.LensMake
    if (info && info.LensModel) data.model = info.LensModel
    if (info && !info.LensMake && info.Make) data.make = info.Make
    if (info && !info.LensModel && info.Model) data.model = info.Model
    if (info && info.DateTimeOriginal) data.time = dayjs(info.DateTimeOriginal).add(9, 'h').toISOString()
    return data
})

const images = await Promise.all(picturesPromises);

// 썸네일은 여기에서 한번 압축
try {
    const thumbnailCommand = `mogrify -resize 10% -quality 60 -path ${thumbnailDir} ${workingDir}/original/*.avif`;
    console.log(thumbnailCommand);
    await asyncExec(thumbnailCommand);
} catch (e) {

}

const medias = sortBy([...images], (a, b) => a.original.localeCompare(b.original));
console.log(medias);

const kmlFiles = await glob([path.join(workingDir, './*.kml')]);
const kmlPromises = kmlFiles.map(async (item) => {
    const targetFile = path.join(workingDir, 'history.json');
    shell.exec(`togeojson ${item} > ${targetFile}`);
    const options = {
        files: targetFile,
        from: /(\\n)+(\\t)+/g,
        to: ""
    };
    await replaceInFile(options);
})

await Promise.all(kmlPromises);

const data: Data = {
    date: date.toString(),
    geojson: `contents/${date}/history.json`,
    movement: {
        walking: 0,
        bus: 0,
        train: 0,
        airplane: 0,
        subway: 0,
        taxi: 0,
        drive: 0,
    },
    medias: medias
}

await fs.promises.writeFile(path.join(workingDir, "index.json"), JSON.stringify(data, null, 4))