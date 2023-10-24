import cv2
import pandas as pd
import time

camera_id = 0
delay = 1
window_name = 'OpenCV QR Code'

qcd = cv2.QRCodeDetector()
cap = cv2.VideoCapture(camera_id)

def startCam():
    code = None
    while True:
        ret, frame = cap.read()
        if ret:
            ret_qr, decoded_info, points, _ = qcd.detectAndDecodeMulti(frame)
            if ret_qr:
                for s, p in zip(decoded_info, points):
                    if s:
                        #print(s)
                        color = (0, 255, 0)

                        code = checkQR(s)
                        try:
                            print("row in CSV list: ", code)
                        except:
                            print("Failed concatonation")
                            print(code)

                        try:
                            print("\033[1;36m Scanned: ", s)
                        except:
                            break
                        time.sleep(1)
                    else:
                        color = (0, 0, 255)
                    frame = cv2.polylines(frame, [p.astype(int)], True, color, 8)

            cv2.imshow(window_name, frame)
        if cv2.waitKey(delay) & 0xFF == ord(' '):

            #print("this is bannanas")
            if not code == None:
                try:
                    useCoupon(code)
                    code = None
                except:
                    print("NO CODE SCANNED")
                    print(code)
            else:
                print("CODE NO LONGER VALID!")

        if cv2.waitKey(delay) & 0xFF == ord('q'):
            break

def useCoupon(coupon):
    df = pd.read_csv(r"idList.csv")
    print(df)
    df = df.drop(coupon)
    print("\033[1;32m Coupon turned in successfully")
    print(df)
    df.to_csv('idList.csv', index=False)

def checkQR(a):
    df = pd.read_csv(r"idList.csv")
    print(a)

    print("\033[1;34m" + df)
    if a in df['ID'].values:
        #print(df[df['ID'].str.match(tempRem)].index[0]) #subsetting with .index and adding '[0]' in order to only reviece int as output

        #toBeDel = df[df['ID'].str.match(tempRem)].index[0]
        #df = df.drop(toBeDel)
        print("\033[1;32m VALID")

        return(df[df['ID'].str.match(a)].index[0])
    else:
        print("\033[93m NOT VALID")

        return None

startCam()

cv2.destroyWindow(window_name)
