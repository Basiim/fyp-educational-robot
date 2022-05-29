#include "MPU9250.h"
MPU9250 mpu;

void setup() {
  // put your setup code here, to run once:
  Serial.begin(115200);
  Wire.begin();
  delay(2000);

  mpu.setup(0x68);
}

void loop() {
  // put your main code here, to run repeatedly:
  if(mpu.update()){
    Serial.print(mpu.getYaw()); Serial.print(", ");
    Serial.print(mpu.getPitch()); Serial.print(", ");
    Serial.println(mpu.getRoll());
  }
}
