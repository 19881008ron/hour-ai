from pathlib import Path
from collections import deque
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

ROOT = Path(__file__).resolve().parents[1]

SOURCES = {
    "a": Path(r"C:\Users\19881\Downloads\科技公司会员等级ABC图标设计 (5).png"),
    "b": Path(r"C:\Users\19881\Downloads\科技公司会员等级ABC图标设计 (4).png"),
    "c": Path(r"C:\Users\19881\Downloads\科技公司会员等级ABC图标设计 (3).png"),
}

OUTPUT_SIZE = 768
VISUAL_SIZE = 604


def is_background(pixel):
    r, g, b = pixel[:3]
    mx = max(r, g, b)
    mn = min(r, g, b)
    # The provided source uses a light checkerboard/watermark background.
    return mx > 205 and (mx - mn) < 30


def build_alpha(image):
    pixels = image.convert("RGBA")
    arr = np.array(pixels)
    rgb = arr[:, :, :3].astype(np.int16)
    mx = rgb.max(axis=2)
    mn = rgb.min(axis=2)
    bg_like = (mx > 205) & ((mx - mn) < 30)

    height, width = bg_like.shape
    exterior = np.zeros((height, width), dtype=bool)
    queue = deque()

    for x in range(width):
      if bg_like[0, x]:
          exterior[0, x] = True
          queue.append(x)
      bottom = (height - 1) * width + x
      if bg_like[height - 1, x]:
          exterior[height - 1, x] = True
          queue.append(bottom)

    for y in range(height):
      left = y * width
      if bg_like[y, 0] and not exterior[y, 0]:
          exterior[y, 0] = True
          queue.append(left)
      right = y * width + width - 1
      if bg_like[y, width - 1] and not exterior[y, width - 1]:
          exterior[y, width - 1] = True
          queue.append(right)

    while queue:
        idx = queue.popleft()
        y, x = divmod(idx, width)
        for ny, nx in ((y - 1, x), (y + 1, x), (y, x - 1), (y, x + 1)):
            if 0 <= ny < height and 0 <= nx < width and bg_like[ny, nx] and not exterior[ny, nx]:
                exterior[ny, nx] = True
                queue.append(ny * width + nx)

    alpha_arr = np.where(exterior, 0, 255).astype(np.uint8)
    alpha = Image.fromarray(alpha_arr, "L").filter(ImageFilter.GaussianBlur(0.5))
    return alpha


def main_badge_bbox(alpha):
    mask = np.array(alpha) > 10
    # Ignore the watermark area in the source images before measuring the badge.
    h, w = mask.shape
    mask[int(h * 0.82) :, int(w * 0.62) :] = False

    rows = np.where(mask.any(axis=1))[0]
    cols = np.where(mask.any(axis=0))[0]
    if not len(rows) or not len(cols):
        return alpha.getbbox()

    left = int(cols[0])
    right = int(cols[-1]) + 1
    top = int(rows[0])
    bottom = int(rows[-1]) + 1
    return left, top, right, bottom


def export_badge(level, source_path):
    image = Image.open(source_path).convert("RGBA")
    alpha = build_alpha(image)
    bbox = main_badge_bbox(alpha)
    if not bbox:
        raise RuntimeError(f"No badge content found in {source_path}")

    left, top, right, bottom = bbox
    pad = 26
    left = max(0, left - pad)
    top = max(0, top - pad)
    right = min(image.width, right + pad)
    bottom = min(image.height, bottom + pad)

    cut = image.crop((left, top, right, bottom))
    cut_alpha = alpha.crop((left, top, right, bottom))
    cut.putalpha(cut_alpha)

    scale = min(VISUAL_SIZE / cut.width, VISUAL_SIZE / cut.height)
    resized = cut.resize((round(cut.width * scale), round(cut.height * scale)), Image.Resampling.LANCZOS)

    canvas = Image.new("RGBA", (OUTPUT_SIZE, OUTPUT_SIZE), (255, 255, 255, 0))
    x = (OUTPUT_SIZE - resized.width) // 2
    y = (OUTPUT_SIZE - resized.height) // 2
    canvas.alpha_composite(resized, (x, y))

    content = canvas.getbbox()
    if content:
        left, top, right, bottom = content
        cleanup = Image.new("L", canvas.size, 0)
        draw = ImageDraw.Draw(cleanup)
        draw.rounded_rectangle(
            (left - 4, top - 4, right + 4, bottom + 4),
            radius=82,
            fill=255,
        )
        cleaned_alpha = Image.composite(canvas.getchannel("A"), Image.new("L", canvas.size, 0), cleanup)
        canvas.putalpha(cleaned_alpha)

    png_path = ROOT / "assets" / f"rank-{level}-premium.png"
    webp_path = ROOT / "assets" / f"rank-{level}-premium.webp"
    canvas.save(png_path, "PNG", optimize=True)
    canvas.save(webp_path, "WEBP", quality=96, method=6, lossless=False)
    return {
        "level": level.upper(),
        "source": str(source_path),
        "bbox": [left, top, right, bottom],
        "output": str(png_path),
        "webp": str(webp_path),
        "size": canvas.size,
        "content_size": resized.size,
        "offset": [x, y],
    }


def main():
    results = [export_badge(level, path) for level, path in SOURCES.items()]
    for item in results:
        print(item)


if __name__ == "__main__":
    main()
