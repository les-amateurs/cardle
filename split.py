from PIL import Image
import itertools

IDS = ["two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king", "ace"]
SUITS = ["hearts", "clubs", "diamonds", "spades"]

empty = Image.open("src/assets/backs/back-0-0.png")
emptydata = empty.load()
width, height = empty.size
for y in range(height):
    for x in range(width):
        if emptydata[x, y][3] != 0:
            emptydata[x, y] = (255, 255, 255, 255)

def clamp(n, min, max):
    if n < min: return min
    if n > max: return max
    return n

def draw_border(img: Image.Image, model: Image.Image | None = None):
    copy = img.copy()
    model = model or img
    width, height = img.size
    neighbors = set(itertools.permutations([-1, -1, 1, 1, 0, 0], r=2))

    copydata = copy.load()
    modeldata = model.load()

    for y in range(height):
        for x in range(width):
            if modeldata[x, y][3] != 0:
                for dx, dy in neighbors:
                    nx, ny = clamp(x + dx, 0, width-1), clamp(y + dy, 0, height-1)
                    if modeldata[nx, ny][3] == 0:
                        copydata[nx, ny] = (0xc0, 0xc0, 0xc0, 0xff)

    return copy

def colorize(img: Image.Image, color: tuple[int, int, int, int]):
    copy = img.copy()
    width, height = img.size

    copydata = copy.load()
    for y in range(height):
        for x in range(width):
            if copydata[x, y] == (255, 255, 255, 255):
                copydata[x, y] = color

    return copy

for i in range(4):
    for j in range(13):
        box = (j * 71, i * 95, (j + 1) * 71, (i + 1) * 95)
        sheet = Image.open("balatro.png")

        new = sheet.crop(box)
        new.save(f"src/assets/cards/none/{IDS[j]}-of-{SUITS[i]}.png")

        white = new.copy()
        pixdata = white.load()
        width, height = white.size
        for y in range(height):
            for x in range(width):
                if pixdata[x, y][3] == 0:
                    pixdata[x, y] = emptydata[x, y]
        white.save(f"src/assets/cards/white/{IDS[j]}-of-{SUITS[i]}.png")

        border = draw_border(new, model=white)
        border.save(f"src/assets/cards/none/border/{IDS[j]}-of-{SUITS[i]}.png")

        green = colorize(white, (0xa2, 0xff, 0xb1, 0xff))
        green.save(f"src/assets/cards/green/{IDS[j]}-of-{SUITS[i]}.png")

        border = draw_border(white)
        border.save(f"src/assets/cards/white/border/{IDS[j]}-of-{SUITS[i]}.png")

        yellow = colorize(white, (0xff, 0xf2, 0x9d, 0xff))
        yellow.save(f"src/assets/cards/yellow/{IDS[j]}-of-{SUITS[i]}.png")
        

sheet = Image.open("backs.png")
dw = sheet.width / 7
dh = sheet.height / 5
for i in range(5):
    for j in range(7):
        box = (j * dw, i * dh, (j + 1) * dw, (i + 1) * dh)
        new = sheet.crop(box)
        new.save(f"src/assets/backs/back-{i}-{j}.png")

        border = draw_border(new)
        border.save(f"src/assets/backs/border/back-{i}-{j}.png")