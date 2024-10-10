from PIL import Image

IDS = ["two", "three", "four", "five", "six", "seven", "eight", "nine", "ten", "jack", "queen", "king", "ace"]
SUITS = ["hearts", "clubs", "diamonds", "spades"]

border = Image.open("src/assets/backs/back-0-0.png")
borderdata = border.load()
width, height = border.size
for y in range(height):
    for x in range(width):
        if borderdata[x, y][3] != 0:
            borderdata[x, y] = (255, 255, 255, 255)

for i in range(4):
    for j in range(13):
        box = (j * 71, i * 95, (j + 1) * 71, (i + 1) * 95)
        sheet = Image.open("balatro.png")
        new = sheet.crop(box)

        # pixdata = new.load()
        # width, height = new.size
        # for y in range(height):
        #     for x in range(width):
        #         if pixdata[x, y][3] == 0:
        #             pixdata[x, y] = borderdata[x, y]
        new.save(f"src/assets/cards/{IDS[j]}-of-{SUITS[i]}.png")

sheet = Image.open("backs.png")
dw = sheet.width / 7
dh = sheet.height / 5
for i in range(5):
    for j in range(7):
        box = (j * dw, i * dh, (j + 1) * dw, (i + 1) * dh)
        new = sheet.crop(box)
        new.save(f"src/assets/backs/back-{i}-{j}.png")