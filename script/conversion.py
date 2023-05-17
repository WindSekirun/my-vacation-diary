import os
import subprocess
from pprint import pprint
from pathlib import Path
import json
import humanize

# date = input('Enter date to convert: ')

date = '20230430'
working_dir = os.path.abspath(f"../contents/{date}")
path = Path(working_dir)
thumbnail_path = Path(f'{working_dir}/thumbnail')
pprint(f'working at {working_dir}')

pprint('Compressing image to well-known format')

original_pictures = [str(p) for p in path.glob("./original/*.HEIC")]
original_pictures_size = humanize.filesize.naturalsize(sum([os.stat(file).st_size for file in original_pictures]))
compress_size = 0
pprint(f'Convert .HEIC to .avif for {len(original_pictures)} items')

for original in original_pictures:
    target = original.replace(".HEIC", ".avif")
    commands = ["convert", original, target]
    # subprocess.run(commands)
    # compress_size = compress_size + os.stat(target).st_size
    # os.remove(original)

pprint(f'Convert result: {original_pictures_size} to {humanize.filesize.naturalsize(compress_size)}')

pprint('Generating thumbnails')

thumbnail_path.mkdir(parents=True, exist_ok=True)
thumbnail_command = ["mogrify", '-resize', '10%', '-quality', '60', '-path', str(thumbnail_path),
                     f"{working_dir}/original/*.avif"]
# subprocess.run(thumbnail_command)

if Path(f'{working_dir}/history.kml').exists() is True:
    commands = ['togeojson', "history.kml", ">", "history.json"]
    subprocess.run(commands)

compressed_pictures = sorted([str(p) for p in path.glob("./original/*.avif")])
medias = []
for compressed in compressed_pictures:
    file_name = Path(compressed).name
    data = {
        "original": f"contents/{date}/original/{file_name}",
        "thumbnail": f"contents/{date}/thumbnail/{file_name}",
        "type": "image",
        "desc": "",
        
    }
    medias.append(data)

data = {
    "date": date,
    "location": "",
    "searchIndex": "",
    "geojson": f'contents/{date}/history.json',
    "thumbnail": "",
    "original": "",
    "movement": {
        "walking": 0,
        "bus": 0,
        "train": 0,
        "airplane": 0
    },
    "medias": medias
}

json_data = json.dumps(data, indent=4)
json_file = os.path.abspath(f'../contents/{date}/index.json')

# if Path(json_file).exists() is not True:
    # with open(json_file, 'w') as f:
        # f.write(json_data)

pprint('Done')
