import processing.serial.*;
import processing.opengl.*;
import toxi.geom.*;
import toxi.processing.*;

Serial port;                         // The serial port

void setup() {
  size(300, 300);
  String portName = "/dev/cu.usbmodem142201";
  port = new Serial(this, portName, 115200);
  port.write('r');
}

void draw() {
 if (keyPressed) {
    if (key == 'f' || key == 'F') {
      port.write('r');
      print("r");
    }
  }
}
