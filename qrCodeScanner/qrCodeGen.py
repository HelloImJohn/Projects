# basic_qrcode.py

import segno
import random
import csv
from PIL import Image, ImageDraw, ImageFilter, ImageOps

r = lambda: random.randint(0, 255)
print('#%02X%02X%02X' % (r(), r(), r()))

invPpl = 1
test = 2


def createcsv(a):
    with open('idList.csv', 'w', newline='') as file:
        writer = csv.writer(file)
        field = ["ID"]

        writer.writerow(field)
        for x in range(a):
            r = "%06x" % random.randint(0, 0xFFFFFF)
            writer.writerow([r])
            genQR(r, x)


def genQR(a, b):
    qrcode = segno.make_qr("{}".format(a))
    qrcode.save(
        "img/scaled_qrcode{}.png".format(b),
        scale=7,
        border=0
        #dark=None,
        #light='black'
    )

def mergeImg(a):
    for x in range(a):
        maskImg = Image.open('img/scaled_qrcode{}.png'.format(x))
        invMaskImg = ImageOps.invert(maskImg)
        im1 = Image.open('template.jpeg')
        im2 = Image.open('img/scaled_qrcode{}.png'.format(x))
        mask_im = invMaskImg.resize(im2.size).convert('L')

        back_im = im1.copy()
        back_im.paste(im2, (1300, 150), mask_im)
        back_im.save('toPrint/ticket{}.jpg'.format(x), quality=95)

        #back_im = im1.copy()
        #back_im.paste(im2)
        #back_im.save('rocket_pillow_paste.jpg', quality=95)

createcsv(invPpl)
#genQR(invPpl)
mergeImg(invPpl)

