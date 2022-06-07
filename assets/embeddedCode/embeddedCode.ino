/*************************************************************************************
 * 
 * 
 * Title: Embedded Software
 * 
 * Version: 0.1
 * 
 * Authors: 
 *          
 * 
 * Description: This file contains the functions that are used to perform various 
 *              tasks in the app. These functions are linked to the button on the 
 *              app.
 * 
 * Refrence(s): 
 * 
 * 
 *************************************************************************************/
#include <WiFi.h>
#include "NewPing.h"
#include <HTTPClient.h>
#include <math.h>

#define LEN 5.5
#define WID 11
#define RADIUS 4
#define TRIGGER_PIN 14
#define ECHO_PIN 12
#define MAX_DISTANCE 400

const char* ssid = "Humara robot";
const char* password = "ameen123";
String serverName = "http://192.168.4.2:3000/sensors/range/";
String serverPath;

float rangeSensor;

NewPing sonar(TRIGGER_PIN, ECHO_PIN, MAX_DISTANCE);
WiFiServer server(80);
String header;
String commands[20];
int idx = 0;

// Variables for the Robot
struct robot{
  double vx; double vy;
  double magnitude; int quadrant;
  double u[4]; int dutyCycle[4];
}Robot;

// Declaring GPIO pins
const int motor1A =  5; const int motor1B = 17;
const int motor2A = 16; const int motor2B =  4;
const int motor3A = 19; const int motor3B = 18;
const int motor4A =  0; const int motor4B =  2;

// Settings for PWM signals
const int freq = 5000;
const int ledChannel1A =  0; const int ledChannel1B =  2;
const int ledChannel2A =  4; const int ledChannel2B =  6;
const int ledChannel3A =  8; const int ledChannel3B = 10;
const int ledChannel4A = 12; const int ledChannel4B = 14;
const int resolution = 8;

// Variables for delay, angle, loop and speed
String inputDelay = "000";
String inputAngle = "000";
String inputLoop = "000";
String inputSpeed = "000";

// Function Prototypes
void commandHandler(int idx);
void routineCalls(int angle);
void getComponents(int angle);
void getSpeeds(float vx, float vy, float omega);
void calculateDutyCycle();
void runMotors(int angle);
void postRequest(String req);

void setup() {
  Serial.begin(115200);

  // Initializing GPIO pins
  pinMode(motor1A, OUTPUT); pinMode(motor1B, OUTPUT);
  pinMode(motor2A, OUTPUT); pinMode(motor2B, OUTPUT);
  pinMode(motor3A, OUTPUT); pinMode(motor3B, OUTPUT);
  pinMode(motor4A, OUTPUT); pinMode(motor4B, OUTPUT);

  // Setting up PWM channels and assigning them to GPIO pins
  ledcSetup(ledChannel1A, freq, resolution); ledcSetup(ledChannel1B, freq, resolution);
  ledcSetup(ledChannel2A, freq, resolution); ledcSetup(ledChannel2B, freq, resolution);
  ledcSetup(ledChannel3A, freq, resolution); ledcSetup(ledChannel3B, freq, resolution);
  ledcSetup(ledChannel4A, freq, resolution); ledcSetup(ledChannel4B, freq, resolution);
 
  ledcAttachPin(motor1A, ledChannel1A); ledcAttachPin(motor1B, ledChannel1B);
  ledcAttachPin(motor2A, ledChannel2A); ledcAttachPin(motor2B, ledChannel2B);
  ledcAttachPin(motor3A, ledChannel3A); ledcAttachPin(motor3B, ledChannel3B);
  ledcAttachPin(motor4A, ledChannel4A); ledcAttachPin(motor4B, ledChannel4B);
  
  // Starting Access Point
  WiFi.softAP(ssid,password);
  IPAddress IP = WiFi.softAPIP();
  Serial.print("Access Point Started with IP: ");
  Serial.println(IP);
  server.begin();

  //initializeHardware();
}

void loop() {
  WiFiClient client = server.available(); // Listening for new clients
  if(client){ // If a client connects
    Serial.println("New Client.");
    String currentLine = ""; // This string holds the incoming data from the client
    while(client.connected()){
      if(client.available()){
        char c = client.read();
        Serial.write(c);
        header += c;
        if(c == '\n'){ // if the byte is a newline character
          // if the current line is blank, you got two newline characters in a row.
          // that's the end of the client HTTP request, so send a response:
          if (currentLine.length() == 0) {
            // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
            // and a content-type so the client knows what's coming, then a blank line:
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println("Connection: close");
            client.println();

            // Read requests
            if(header.indexOf("GET /start") >= 0){
              commands[idx] = "start";
              idx++;
            }
            else if(header.indexOf("GET /forward") >= 0){
              commands[idx] = "forward";
              idx++;
            }
            else if(header.indexOf("GET /backward") >= 0){
              commands[idx] = "backward";
              idx++;
            }
            else if(header.indexOf("GET /stop") >= 0){
              commands[idx] = "stop";
              idx++;
            }
            else if(header.indexOf("GET /delay") >= 0){
              int x = header.indexOf("-");
              inputDelay.setCharAt(0,header[x+1]);
              inputDelay.setCharAt(1,header[x+2]);
              inputDelay.setCharAt(2,header[x+3]);
              String newString = "delay";
              newString.concat("-");
              newString.concat(inputDelay);
              Serial.println(newString);
              commands[idx] = newString;
              idx++;
            }
            else if(header.indexOf("GET /angle") >= 0){
              int x = header.indexOf("-");
              inputAngle.setCharAt(0,header[x+1]);
              inputAngle.setCharAt(1,header[x+2]);
              inputAngle.setCharAt(2,header[x+3]);
              String newString = "angle";
              newString.concat("-");
              newString.concat(inputAngle);
              Serial.println(newString);
              commands[idx] = newString;
              idx++;
            }
            else if(header.indexOf("GET /speed") >= 0){
              int x = header.indexOf("-");
              inputSpeed.setCharAt(0,header[x+1]);
              inputSpeed.setCharAt(1,header[x+2]);
              inputSpeed.setCharAt(2,header[x+3]);
              String newString = "speed";
              newString.concat("-");
              newString.concat(inputSpeed);
              Serial.println(newString);
              commands[idx] = newString;
              idx++;
            }
            else if(header.indexOf("GET /loop") >= 0){
              commands[idx] = "loop";
              idx++;
              int x = header.indexOf("-");
              inputLoop.setCharAt(0,header[x+1]);
              inputLoop.setCharAt(1,header[x+2]);
              inputLoop.setCharAt(2,header[x+3]);
            }
            else if(header.indexOf("GET /endloop") >= 0){
              commands[idx] = "endloop";
              idx++;
            }
            else if(header.indexOf("GET /final") >= 0){
              commands[idx] = "final";
              commandHandler(idx);
              idx = 0;
            }
            client.println(); // The HTTP response ends with another blank line
            break;
          }
          else{
            currentLine = "";
          }
        }
        else if(c != '\r'){
          currentLine += c;
        }
      }
    }
      header = "";
      client.stop();
      Serial.println("Client Disconnected");
      Serial.println("");
  }
  /***** SENSORS *****/
  rangeSensor = sonar.ping_cm();
  postRequest(String(rangeSensor));
  delay(500);
  //Serial.print("Distance: ");
  //`Serial.println(rangeSensor);
}

void commandHandler(int fin){
  for(int i = 0; i < fin; i++){
    Serial.print("Command: ");
    Serial.println(commands[i]);
    if(commands[i] == "start")
      break;
    if(commands[i] == "forward")
      routineCalls(90);
    if(commands[i] == "backward")
      routineCalls(180);
    if(commands[i] == "stop"){
      ledcWrite(ledChannel1A, 255);  ledcWrite(ledChannel1B, 255);
      ledcWrite(ledChannel2A, 255);  ledcWrite(ledChannel2B, 255);
      ledcWrite(ledChannel3A, 255);  ledcWrite(ledChannel3B, 255);
      ledcWrite(ledChannel4A, 255);  ledcWrite(ledChannel4B, 255);
    }
    if(commands[i].indexOf("delay") >= 0){
      int x = commands[i].indexOf("-");
      String cmd = commands[i];
      String currentDelay = "000";
      currentDelay.setCharAt(0,cmd[x+1]);
      currentDelay.setCharAt(1,cmd[x+2]);
      currentDelay.setCharAt(2,cmd[x+3]);
      Serial.print("Delay: ");
      Serial.println(currentDelay);
      delay((currentDelay.toInt())*1000);
    }
    if(commands[i].indexOf("angle") >= 0){
      int x = commands[i].indexOf("-");
      String cmd = commands[i];
      String currentAngle = "000";
      currentAngle.setCharAt(0,cmd[x+1]);
      currentAngle.setCharAt(1,cmd[x+2]);
      currentAngle.setCharAt(2,cmd[x+3]);
      Serial.print("Angle: ");
      Serial.println(currentAngle);
      routineCalls(currentAngle.toInt());
    }
    if(commands[i].indexOf("speed") >= 0){
      int x = commands[i].indexOf("-");
      String cmd = commands[i];
      String currentSpeed = "000";
      currentSpeed.setCharAt(0,cmd[x+1]);
      currentSpeed.setCharAt(1,cmd[x+2]);
      currentSpeed.setCharAt(2,cmd[x+3]);
      Serial.print("Speed: ");
      Serial.println(currentSpeed);
      Robot.magnitude = (0.62 * currentSpeed.toInt())/100; //0.62= linear velocity of robot calculated by rpm
    }
    if(commands[i] == "loop")
      break;
    if(commands[i] == "endloop")
      break;
    if(commands[i] == "final")
      break;
  }
}

void routineCalls(int angle){
  getComponents(angle);
  getSpeeds(Robot.vx, Robot.vy, 0);
  calculateDutyCycle();
  runMotors(angle);
}
void getComponents(int angle){
  float radAngle = angle * (3.145/180);
  Robot.vx = Robot.magnitude * cos(radAngle);
  Robot.vy = Robot.magnitude * sin(radAngle);
}
void getSpeeds(float vx, float vy, float omega){
  Robot.u[0] = abs((0.25)*(((vy-vx)*100)+(LEN-WID)*omega)); // w2
  Robot.u[1] = abs((0.25)*(((vy+vx)*100)-(LEN-WID)*omega)); // w1
  Robot.u[2] = abs((0.25)*(((vy-vx)*100)-(LEN-WID)*omega)); // w3
  Robot.u[3] = abs((0.25)*(((vy+vx)*100)+(LEN-WID)*omega)); // w4
}
void calculateDutyCycle(){
  float maxSpeed = Robot.u[0];
  for(int i = 0; i < 4; i++)
    if(Robot.u[i] > maxSpeed)
      maxSpeed = Robot.u[i];
  maxSpeed = maxSpeed * 10;
  int mappedMax = map(inputSpeed.toInt(),0,100,100,255);
  Serial.print("U's: ");
  Serial.print(Robot.u[1]);
  Serial.print(Robot.u[0]);
  Serial.print(Robot.u[2]);
  Serial.println(Robot.u[3]);
  Serial.print("Max Speed: ");
  Serial.println(maxSpeed);
  Serial.print("Mapped Max: ");
  Serial.println(mappedMax);
  Robot.dutyCycle[0]= map(Robot.u[1]*10, 0, maxSpeed, 0, mappedMax);
  Robot.dutyCycle[1]= map(Robot.u[0]*10, 0, maxSpeed, 0, mappedMax);
  Robot.dutyCycle[2]= map(Robot.u[2]*10, 0, maxSpeed, 0, mappedMax);
  Robot.dutyCycle[3]= map(Robot.u[3]*10, 0, maxSpeed, 0, mappedMax);
  Serial.print("Duty Cycles: ");
  Serial.print(Robot.dutyCycle[0]);
  Serial.print(Robot.dutyCycle[1]);
  Serial.print(Robot.dutyCycle[2]);
  Serial.println(Robot.dutyCycle[3]);
}
void runMotors(int angle){
  if(angle==0){
    ledcWrite(ledChannel1B, Robot.dutyCycle[0]); ledcWrite(ledChannel1A, 0);
    ledcWrite(ledChannel2A, Robot.dutyCycle[1]); ledcWrite(ledChannel2B, 0);
    ledcWrite(ledChannel3A, Robot.dutyCycle[2]); ledcWrite(ledChannel3B, 0);
    ledcWrite(ledChannel4B, Robot.dutyCycle[3]); ledcWrite(ledChannel4A, 0); 
   }
  if(angle>0 && angle<180){ ///for quadrant 1 & 4
    ledcWrite(ledChannel2A, Robot.dutyCycle[0]); ledcWrite(ledChannel2B, 0);
    ledcWrite(ledChannel1A, Robot.dutyCycle[1]); ledcWrite(ledChannel1B, 0);
    ledcWrite(ledChannel4A, Robot.dutyCycle[2]); ledcWrite(ledChannel4B, 0);
    ledcWrite(ledChannel3A, Robot.dutyCycle[3]); ledcWrite(ledChannel3B, 0); 
  }
  if(angle==180){
    ledcWrite(ledChannel1A, Robot.dutyCycle[0]); ledcWrite(ledChannel1B, 0);
    ledcWrite(ledChannel2B, Robot.dutyCycle[1]); ledcWrite(ledChannel2A, 0);
    ledcWrite(ledChannel3B, Robot.dutyCycle[2]); ledcWrite(ledChannel3A, 0);
    ledcWrite(ledChannel4A, Robot.dutyCycle[3]); ledcWrite(ledChannel4B, 0); 
   }
 
  if(angle>180) {///for quadrant 1 & 4
   ledcWrite(ledChannel2A, 0); ledcWrite(ledChannel2B, Robot.dutyCycle[0]);
   ledcWrite(ledChannel1A, 0); ledcWrite(ledChannel1B, Robot.dutyCycle[1]);
   ledcWrite(ledChannel4A, 0); ledcWrite(ledChannel4B, Robot.dutyCycle[2]);
   ledcWrite(ledChannel3A, 0); ledcWrite(ledChannel3B, Robot.dutyCycle[3]); 
  } 
}

void postRequest(String req){
     HTTPClient http;
     serverPath = serverName + req;
     Serial.println(serverPath);
     // Your Domain name with URL path or IP address with path
     http.begin(serverPath.c_str());
     // Send HTTP GET request
     int httpResponseCode = http.GET();
     if (httpResponseCode>0) {
      Serial.print("HTTP Response code: ");
      Serial.println(httpResponseCode);
      String payload = http.getString();
    }
    else {
      Serial.print("Error code: ");
      Serial.println(httpResponseCode);
    }
    // Free resources
    http.end();
}
