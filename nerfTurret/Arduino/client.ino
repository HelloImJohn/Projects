#include "Servo.h"

const int ledPin =  LED_BUILTIN;
//LED_BUILTIN
//13
Servo servoX;
Servo servoY;
Servo servoWhoosh;

String serialData;
//Add Servos
void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  Serial.setTimeout(10);
  servoX.attach(8);
  servoY.attach(9);
  servoWhoosh.attach(10);
  servoX.write(90);
  servoY.write(90);
  servoWhoosh.write(110);
  pinMode(ledPin, OUTPUT);
}

void loop() {
  // put your main code here, to run repeatedly:
  //Serial.write(1);
  if (Serial.available())
  {
    char ch = Serial.read();
    if (ch == 'f' || ch== 'F');
    {
      digitalWrite(ledPin, HIGH);
      delay(100);
      digitalWrite(ledPin, LOW);
      Serial.write('1');
    }
  }
  delay(100);
  //Serial.println(5);
}

void serialEvent() {
  serialData = Serial.readString();
  servoX.write(parseDataX(serialData));
  servoY.write(parseDataY(serialData));
  servoWhoosh.write(parseDataS(serialData));
  Serial.print(parseDataX(serialData));
}

int parseDataX(String data){
  data.remove(data.indexOf("Y"));
  data.remove(data.indexOf("X"), 1);
  return data.toInt();
}

int parseDataY(String data){
  data.remove(0,data.indexOf("Y") + 1);
  return data.toInt();
}

int parseDataS(String data) {
  data.remove(0,data.indexOf("S") +1); 
  return data.toInt();
}
