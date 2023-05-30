# my-vacation-diary
Record of visiting Japan for a month vacation (May 2023, 2023.04.29 ~ 2023.05.30)

Site has hosted on Github Pages (https://jvd.kohaku.moe)

## Development & Build
* yarn run dev
* yarn run build

access http://localhost:3000 (for vite dev) / http://localhost:9001 (static file host for access contents/)

## Script

### convert
* Converting .HEIC, .JPG to .avif (with EXIF parsing)
* Convert google map timeline kml to geojson
* Generating thumbnail image
* Generating index.json

```
cd script
yarn run convert
```

### stat
* Summarize Movement, coordinates

```
cd script
yarn run stat
```

## LICENSE
MIT License