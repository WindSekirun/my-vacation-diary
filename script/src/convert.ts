import prompts from 'prompts';
import fs from "fs";
import path from 'path';
import { fileURLToPath } from 'url';
import { glob } from 'glob';
import exifr from 'exifr'
import { Media } from './media';
import shell from 'shelljs';
import pkg from 'replace-in-file';
import { Data } from './data';
import dayjs from 'dayjs';
const { replaceInFile } = pkg;

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
const workingDir = path.join(__dirname, `../../contents/${date}`);
const thumbnailDir = path.join(workingDir, "./thumbnail")
console.log(`working on ${workingDir}`);

const originalPictures = await glob([path.join(workingDir, './original/*.HEIC')]);
const promises = originalPictures.sort().map(async (item) => {
    const targetOriginalFile = item.replace(".HEIC", ".avif");
    const fileName = path.basename(targetOriginalFile);

    if (!fs.existsSync(targetOriginalFile)) {
        shell.exec(`convert ${item} ${targetOriginalFile}`);
    }

    const gpsOutput = await exifr.gps(item);
    const info = await exifr.parse(item, ["LensModel", "LensMake", "DateTimeOriginal", "OffsetTimeOriginal"]);
    const day = dayjs(info.DateTimeOriginal).add(9, 'h');

    return {
        original: `contents/${date}/original/${fileName}`,
        thumbnail: `contents/${date}/thumbnail/${fileName}`,
        type: "image",
        desc: "",
        latitude: gpsOutput.latitude,
        longitude: gpsOutput.longitude,
        model: info.LensModel,
        make: info.LensMake,
        time: day.toISOString()
    }
})

const medias = await Promise.all(promises)

const thumbnailCommand = `mogrify -resize 10% -quality 60 -path ${thumbnailDir} ${workingDir}/original/*.avif`;
console.log(thumbnailCommand);
shell.exec(thumbnailCommand);

const kmlFiles = await glob([path.join(workingDir, './*.kml')])
kmlFiles.forEach(async (item) => {
    const targetFile = path.join(workingDir, 'history.json');
    shell.exec(`togeojson ${item} > ${targetFile}`);
    const options = {
        files: targetFile,
        from: /(\\n)+(\\t)+/g,
        to: ""
    }
    await replaceInFile(options)
})

const data: Data = {
    date: date.toString(),
    location: "",
    searchIndex: "",
    geojson: `contents/${date}/history.json`,
    thumbnail: "",
    original: "",
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