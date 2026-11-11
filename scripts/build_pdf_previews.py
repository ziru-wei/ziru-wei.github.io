"""Generate static page thumbnails: python3 scripts/build_pdf_previews.py path/to/paper.pdf"""

import argparse
from pathlib import Path
import subprocess
import tempfile

from PIL import Image


def build_previews(pdf, output=None, width=560):
    output = output or pdf.parent / 'pdf-pages'
    output.mkdir(exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='pdf-previews-') as temp:
        prefix = Path(temp) / 'page'
        subprocess.run([
            'pdftoppm', '-scale-to-x', str(width), '-scale-to-y', '-1',
            '-png', str(pdf), str(prefix),
        ], check=True)
        pages = sorted(Path(temp).glob('page-*.png'), key=lambda p: int(p.stem.split('-')[-1]))
        for number, page in enumerate(pages, start=1):
            with Image.open(page) as image:
                image.convert('RGB').save(output / f'page-{number:02d}.webp', quality=85)
    print(f'{pdf.name}: {len(pages)} pages saved to {output}')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('pdf', type=Path, nargs='+')
    parser.add_argument('--output-dir', type=Path)
    parser.add_argument('--width', type=int, default=560)
    args = parser.parse_args()
    if args.output_dir and len(args.pdf) != 1:
        parser.error('--output-dir requires exactly one PDF')
    if args.width < 1:
        parser.error('--width must be positive')
    for pdf in args.pdf:
        build_previews(pdf.resolve(strict=True), args.output_dir, args.width)
