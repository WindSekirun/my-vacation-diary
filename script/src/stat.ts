import { fileURLToPath } from 'url';
import path from 'path';
import { glob } from 'glob';
import fs from "fs";
import { Data, Movement } from './data';
import { GeoJsonRoot } from './geojson';

function distinctBy<T, R>(list: T[], selector: (item: T) => R): T[] {
    const result: T[] = [];
    const set = new Set<R>();
    list.forEach((item) => {
        const select = selector(item)
        if (!set.has(select)) {
            set.add(select)
            result.push(item);
        }
    })
    return result;
}

function round(number: number): number {
    return Math.round(number * 100) / 100;
}

// __dirname is not defined in ES module scope
const filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(filename);

const workingDir = path.join(__dirname, `../../contents/`);

// movement 취합
const totalMovement: Movement = {
    walking: 0,
    bus: 0,
    train: 0,
    airplane: 0,
    subway: 0,
    taxi: 0,
    drive: 0
};
const indexList = await glob([path.join(workingDir, './*/index.json')]);
const indexPromises = indexList.map(async item => {
    const data: Data = JSON.parse((await fs.promises.readFile(item)).toString());
    const movement = data.movement;
    totalMovement.walking += movement.walking ?? 0;
    totalMovement.bus += movement.bus ?? 0;
    totalMovement.train += movement.train ?? 0;
    totalMovement.airplane += movement.airplane ?? 0;
    totalMovement.subway += movement.subway ?? 0;
    totalMovement.taxi += movement.taxi ?? 0;
    totalMovement.drive += movement.drive ?? 0;
})

await Promise.all(indexPromises)
totalMovement.walking = round(totalMovement.walking)
totalMovement.bus = round(totalMovement.bus)
totalMovement.train = round(totalMovement.train)
totalMovement.airplane = round(totalMovement.airplane)
totalMovement.subway = round(totalMovement.subway)
totalMovement.taxi = round(totalMovement.taxi)
totalMovement.drive = round(totalMovement.drive)

// 방문한 장소 통계
const geoJsonList = await glob([path.join(workingDir, './*/history.json')]);
const placePromises = geoJsonList.map(async item => {
    const geojson: GeoJsonRoot = JSON.parse((await fs.promises.readFile(item)).toString());
    const originalGeoPointList = geojson.features
        .filter((item) => item.geometry.type == "Point");

    const geoPointList = distinctBy(originalGeoPointList, (item) => item.properties.name);
    const placeList = geoPointList.map((item) => item.properties.name);
    return placeList;
})
const placeList = await Promise.all(placePromises);
const placeFlatten = distinctBy(placeList.flat(), (a) => a);

const coordinatePromises = geoJsonList.map(async item => {
    if (item.includes('20230429/') || item.includes('20230530/')) {
        return [];
    }
    
    const geojson: GeoJsonRoot = JSON.parse((await fs.promises.readFile(item)).toString());
    const coordinates: number[][][] = geojson.features
        .filter((item) => item.geometry.type == "LineString")
        .map(item => item.geometry.coordinates.map(item => [item[1], item[0]]))
    return coordinates
});
const coordinateList: number[][][][] = await Promise.all(coordinatePromises)
const coordinateFlatten: number[][][] = coordinateList.flat();

// 이미지 갯수
const imageCount = (await glob([path.join(workingDir, './*/original/*.avif')])).length

const data = {
    movement: totalMovement,
    sum: placeFlatten.length,
    average: round(placeFlatten.length / geoJsonList.length),
    coordinates: coordinateFlatten,
    imageCount: imageCount,
    imageCountAverage: round(imageCount / geoJsonList.length)
}
await fs.promises.writeFile(path.join(workingDir, "stat.json"), JSON.stringify(data))