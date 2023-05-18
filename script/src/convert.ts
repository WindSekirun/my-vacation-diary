import prompts from 'prompts';
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import exifr from 'exifr'
import shell from 'shelljs';
import { asyncExec } from 'async-shelljs'
import pkg from 'replace-in-file';
import { Data } from './data';
import dayjs from 'dayjs';
const { replaceInFile } = pkg;

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
// const date = "20230503"
const workingDir = path.join(__dirname, `../../contents/${date}`);
const thumbnailDir = path.join(workingDir, "./thumbnail")
console.log(`working on ${workingDir}`);

const originalPictures = await glob([path.join(workingDir, './original/*.HEIC')]);
const picturesPromises = originalPictures.sort().map(async (item) => {
    const targetOriginalFile = item.replace(".HEIC", ".avif");
    const fileName = path.basename(targetOriginalFile);

    if (!fs.existsSync(targetOriginalFile)) {
        await asyncExec(`convert ${item} ${targetOriginalFile}`);
    }

    let gpsOutput = null;
    let info = null;

    try {
        gpsOutput = await exifr.gps(item);
    } catch (e) {
    }

    try {
        info = await exifr.parse(item, ["LensModel", "LensMake", "DateTimeOriginal", "OffsetTimeOriginal"]);
    } catch (e) {
    }

    const data = {
        original: `contents/${date}/original/${fileName}`,
        thumbnail: `contents/${date}/thumbnail/${fileName}`,
        type: "image",
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
    if (info && info.DateTimeOriginal) data.time = dayjs(info.DateTimeOriginal).add(9, 'h').toISOString()
    return data
})

const images = await Promise.all(picturesPromises);

// 이미지용 썸네일은 여기에서 한번 압축
const thumbnailCommand = `mogrify -resize 10% -quality 60 -path ${thumbnailDir} ${workingDir}/original/*.avif`;
console.log(thumbnailCommand);
await asyncExec(thumbnailCommand);

const originalVideos = await glob([path.join(workingDir, './original/*.MOV')]);
const videoPromises = originalVideos.sort().map(async (item) => {
    const targetOriginalFile = item.replace(".MOV", ".mp4");
    const targetThumbnailFile1 = targetOriginalFile.replace(".mp4", ".jpg")
    const targetThumbnailFile2 = targetThumbnailFile1.replace(".jpg", ".avif")
    const name = path.parse(targetOriginalFile).name;

    if (!fs.existsSync(targetOriginalFile)) {
        await asyncExec(`ffmpeg -i ${item} ${targetOriginalFile}`);
    }

    // 비디오를 위한 썸네일 이미지 저장
    if (!fs.existsSync(targetThumbnailFile1)) {
        await asyncExec(`ffmpeg -i ${item} -vf "select=eq(n\\,0)" -q:v 1 "${targetThumbnailFile1}"`);
        await asyncExec(`convert ${targetThumbnailFile1} ${targetThumbnailFile2}`);
        await asyncExec(`mogrify -resize 10% -quality 60 -path ${thumbnailDir} ${targetThumbnailFile2}`);
    }

    await fs.promises.unlink(targetThumbnailFile1);
    await fs.promises.unlink(targetThumbnailFile2);

    return {
        original: `contents/${date}/original/${name}.mp4`,
        thumbnail: `contents/${date}/thumbnail/${name}.avif`,
        type: "video",
        desc: "",
        latitude: 0,
        longitude: 0,
        model: "",
        make: "",
        time: ""
    }
})

const videos = await Promise.all(videoPromises);
const medias = sortBy([...images, ...videos], (a, b) => a.original.localeCompare(b.original));
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
    location: "",
    searchIndex: "",
    geojson: `contents/${date}/history.json`,
    original: "",
    thumbnail: "",
    movement: {
        walking: 0,
        bus: 0,
        train: 0,
        airplane: 0,
        subway: 0,
        taxi: 0
    },
    medias: medias
}

await fs.promises.writeFile(path.join(workingDir, "index.json"), JSON.stringify(data, null, 4))