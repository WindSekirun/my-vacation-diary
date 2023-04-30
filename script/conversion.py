import os
import subprocess
from pprint import pprint
from pathlib import Path
import humanize

# date = input('Enter date to convert: ')

date = '20230429'
working_dir = os.path.abspath(f"../contents/{date}")
path = Path(working_dir)
pprint(f'working at {working_dir}')

pprint('Compressing image/video to well-known format')

original_pictures = [str(p) for p in path.glob("./original/*.HEIC")]
original_pictures_size = humanize.filesize.naturalsize(sum([os.stat(file).st_size for file in original_pictures]))
compress_size = 0
pprint(f'Convert .HEIC to .avif for {len(original_pictures)} items')

for original in original_pictures:
    target = original.replace(".HEIC", ".avif")
    commands = ["convert", original, target]
    subprocess.run(commands)
    compress_size = compress_size + os.stat(target).st_size
    os.remove(original)

pprint(f'Convert result: {len(original_pictures)} items:  {original_pictures_size} to {humanize.filesize.naturalsize(compress_size)}')

pprint('Generating thumbnails')

compressed_pictures = [str(p) for p in path.glob("./original/*.avif")]
pprint(f'Generate image thumbnails for {len(compressed_pictures)} items')

# TODO: downsize

compressed_videos = [str(p) for p in path.glob("./original/*.mp4")]
pprint(f'Generate video thumbnails for {len(compressed_videos)} items')

# TODO: downsize video (not supported)