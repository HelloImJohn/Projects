import cv2
import csv
import pandas as pd
import time
from pynput import keyboard
from threading import Thread



camera_id = 0
delay = 1
window_name = 'OpenCV QR Code'

qcd = cv2.QRCodeDetector()
cap = cv2.VideoCapture(camera_id)


def startCam():

    currentCoupon = "nothingrnlol"
    print(currentCoupon)
    while True:
        
        ret, frame = cap.read()
        if ret:
            ret_qr, decoded_info, points, _ = qcd.detectAndDecodeMulti(frame)
            if ret_qr:
                for s, p in zip(decoded_info, points):
                    if s:
                        print(s)
                        color = (0, 255, 0)

                        code = checkQR(s)
                        print(code)
                        if not code == "hotPotato":
                            currentCoupon == code

                        time.sleep(1)
                    else:
                        color = (0, 0, 255)
                    frame = cv2.polylines(frame, [p.astype(int)], True, color, 8)

            cv2.imshow(window_name, frame)

        if cv2.waitKey(delay) & 0xFF == ord('q'):
            break

#trying to find workaround multithreading and using this function
def useCoupon(coupon):
    t2 = Thread(target=startCam())
    t2.start()
    def on_press(key):
        try:
            print('alphanumeric key {0} pressed'.format(
                key.char))
        except AttributeError:
            print('special key {0} pressed'.format(
                key))

    def on_release(key):
        print('{0} released'.format(
            key))
        if key == keyboard.Key.esc:
            # Stop listener
            return False

    # Collect events until released
    with keyboard.Listener(
            on_press=on_press,
            on_release=on_release) as listener:
        listener.join()

    # ...or, in a non-blocking fashion:
    listener = keyboard.Listener(
        on_press=on_press,
        on_release=on_release)
    listener.start()

def checkQR(a):
    tempRem = a
    df = pd.read_csv(r"idList.csv")

    #print(df)
    if tempRem in df['ID'].values:
        #print(df[df['ID'].str.match(tempRem)].index[0]) #subsetting with .index and adding '[0]' in order to only reviece int as output

        #toBeDel = df[df['ID'].str.match(tempRem)].index[0]
        #df = df.drop(toBeDel)
        print("VALID")

        return(df[df['ID'].str.match(tempRem)].index[0])
    else:
        print("NOT VALID")
    #print(df)

    #df.to_csv('idList.csv', encoding='utf-8', index=False)


    #with open('idList.csv', 'rt') as f:
    #    reader = csv.reader(f, delimiter=',')  # good point by @paco
    #    for row in reader:
    #        for field in row:
    #            if field == tempRem:
    #                print("is in file")
    #                print(row)


#checkQR()


startCam()


cv2.destroyWindow(window_name)
