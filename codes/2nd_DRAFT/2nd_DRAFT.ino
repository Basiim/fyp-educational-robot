#include <WiFi.h>
#include <math.h>
#define LEN 5.5  
#define WID 11
#define RADIUS 4
  const char* ssid = "oppo";
  const char* password = "ameen123"; 
  
  WiFiServer server(80);
const int ledPin = 16;  // 16 corresponds to GPIO16

// setting PWM properties
const int freq = 5000;
const int ledChannel1 = 0;
const int ledChannel2 = 2;
const int ledChannel3 = 4;
const int ledChannel4 = 6;
const int resolution = 8;

struct kinematics{
float vx;
float vy;
float magnitude;
int quadrant;
}v1;
struct speed_of_wheels{
  float u[4];
  int dutyCycle[4];
}wheelSpeed;
// Variable to store the HTTP request
String header;

// Assign output variables to GPIO pins
const int motor1A = 15;
const int motor1B = 2;
const int motor2A = 0;
const int motor2B = 4;
const int motor3A = 16;
const int motor3B = 17;
const int motor4A = 5;
const int motor4B = 18;
const int motor1PWM = 12;
const int motor2PWM = 14;
const int motor3PWM = 27;
const int motor4PWM = 26;
String commands[20]; 
int i=0;
float _speed;
String a = "00";
int duty_cycle;

void command_handler(int x);
void setup() {
  Serial.begin(119200);
  // Initialize the output variables as outputs
  pinMode(motor1A, OUTPUT); pinMode(motor1B, OUTPUT);
  pinMode(motor2A, OUTPUT); pinMode(motor2B, OUTPUT);
  pinMode(motor3A, OUTPUT); pinMode(motor3B, OUTPUT);
  pinMode(motor4A, OUTPUT); pinMode(motor4B, OUTPUT);
  // Set outputs to LOW
  digitalWrite(motor1A, LOW); digitalWrite(motor1B, LOW);
  digitalWrite(motor2A, LOW); digitalWrite(motor2B, LOW);
  digitalWrite(motor3A, LOW); digitalWrite(motor3B, LOW);
  digitalWrite(motor4A, LOW); digitalWrite(motor4B, LOW);
  ledcSetup(ledChannel1, freq, resolution);
  ledcSetup(ledChannel2, freq, resolution);
  ledcSetup(ledChannel3, freq, resolution);
  ledcSetup(ledChannel4, freq, resolution);
  ledcAttachPin(motor1PWM, ledChannel1);
  ledcAttachPin(motor2PWM, ledChannel2);
  ledcAttachPin(motor3PWM, ledChannel3);
  ledcAttachPin(motor4PWM, ledChannel4);
  // Connect to Wi-Fi network with SSID and password
  /***WiFi.softAP(ssid, password);
  IPAddress IP = WiFi.softAPIP();
  Serial.print("IP");
  Serial.println(IP);
  server.begin();**/
  Serial.print("Connecting to ");
  Serial.println(ssid);
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  // Print local IP address and start web server
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  server.begin();
      get_components(5,60);
    get_speeds(v1.vx, v1.vy, 0);
    calculate_dutycycle();
    ledcWrite(ledChannel1, wheelSpeed.dutyCycle[0]);
    ledcWrite(ledChannel2, wheelSpeed.dutyCycle[1]);
    ledcWrite(ledChannel3, wheelSpeed.dutyCycle[2]);
    ledcWrite(ledChannel4, wheelSpeed.dutyCycle[3]);
    run_motors();
}

/**void loop(){
  WiFiClient client = server.available();   // Listen for incoming clients  
  if (client) {                             // If a new client connects,
    Serial.println("New Client.");          // print a message out in the serial port
    String currentLine = "";                // make a String to hold incoming data from the client
    while (client.connected()) {            // loop while the client's connected
      if (client.available()) {             // if there's bytes to read from the client,
        char c = client.read();             // read a byte, then
        Serial.write(c);                    // print it out the serial monitor
        header += c;
        if (c == '\n') {                    // if the byte is a newline character
          // if the current line is blank, you got two newline characters in a row.
          // that's the end of the client HTTP request, so send a response:
          if (currentLine.length() == 0) {
            // HTTP headers always start with a response code (e.g. HTTP/1.1 200 OK)
            // and a content-type so the client knows what's coming, then a blank line:
            client.println("HTTP/1.1 200 OK");
            client.println("Content-type:text/html");
            client.println("Connection: close");
            client.println();
            // turns the GPIOs on and off 
            if (header.indexOf("GET /forward") >= 0) {
              commands[i]= "forward"; 
                    i++;
            } else if (header.indexOf("GET /stop") >= 0) {
              commands[i]= "stop"; 
              i++;
            }else if (header.indexOf("GET /backward") >= 0) {
               commands[i]="backward";
               i++;
            } 
            else if (header.indexOf("GET /left") >= 0) {
              commands[i]= "left";   
              i++;              
            }
            if (header.indexOf("GET /right") >= 0) {
              commands[i]= "right";     
              i++;             
            }else if (header.indexOf("GET /delay") >= 0){  
              int c= header.indexOf("-");
              int d= header.indexOf("-", c+1);
              commands[i]= "delay";
              i++;
                a.setCharAt(0, header[c+1]);
                a.setCharAt(1, header[c+2]);
                Serial.println(a);  
            }
            else if(header.indexOf("GET /final")>=0){
              for(int j=0; j<i; j++)
              {
                Serial.println(commands[j]);
                }
                command_handler(i);
                i=0;
            }
            // The HTTP response ends with another blank line
            client.println();
            // Break out of the while loop
            break;
          } else { // if you got a newline, then clear currentLine
            currentLine = "";
          }
        } else if (c != '\r') {  // if you got anything else but a carriage return character,
          currentLine += c;      // add it to the end of the currentLine
        }
      }
    }
    // Clear the header variable
    header = "";
    // Close the connection
    client.stop();
    Serial.println("Client disconnected.");
    Serial.println("");
  }
  }
  void command_handler(int x)
  {
    for (int w=0; w<x; w++)
    {
      if (commands[w] == "forward") {
              digitalWrite(motor1A, HIGH); digitalWrite(motor1B, LOW);
              digitalWrite(motor2A, HIGH); digitalWrite(motor2B, LOW);
              digitalWrite(motor3A, HIGH); digitalWrite(motor3B, LOW);
              digitalWrite(motor4A, HIGH); digitalWrite(motor4B, LOW);                 
            } else if (commands[w] == "stop") {
               digitalWrite(motor1A, LOW); digitalWrite(motor1B, LOW);
               digitalWrite(motor2A, LOW); digitalWrite(motor2B, LOW);
               digitalWrite(motor3A, LOW); digitalWrite(motor3B, LOW);
               digitalWrite(motor4A, LOW); digitalWrite(motor4B, LOW);
            }else if (commands[w] == "backward") {
               digitalWrite(motor1A, LOW); digitalWrite(motor1B, HIGH);
               digitalWrite(motor2A, LOW); digitalWrite(motor2B, HIGH);
               digitalWrite(motor3A, LOW); digitalWrite(motor3B, HIGH);
               digitalWrite(motor4A, LOW); digitalWrite(motor4B, HIGH);
            } 
            else if (commands[w] == "left") {
              digitalWrite(motor1A, HIGH); digitalWrite(motor1B, LOW);
              digitalWrite(motor2A, HIGH); digitalWrite(motor2B, LOW);
              digitalWrite(motor3A, LOW); digitalWrite(motor3B, HIGH);
              digitalWrite(motor4A, LOW); digitalWrite(motor4B, HIGH);                 
            }
            if (commands[w] == "right") {
              digitalWrite(motor1A, LOW); digitalWrite(motor1B, HIGH);
              digitalWrite(motor2A, LOW); digitalWrite(motor2B, HIGH);
              digitalWrite(motor3A, HIGH); digitalWrite(motor3B, LOW);
              digitalWrite(motor4A, HIGH); digitalWrite(motor4B, LOW);                 
            }
            if (commands[w] == "delay"){
                int x=a.toInt();  
                Serial.println(a);
                Serial.println(x);                              
              delay(x*1000);
            }
    }
  }***/
  void loop(){

  }
  /** calculates the linear velocity of robot by specific range given by user***/
 float get_speed(float range){ 
    _speed = (0.62 * range)/100; //0.62= linear velocity of robot calculated by rpm
    return _speed;
 }
 void get_components(float range, int angle){
  v1.magnitude= get_speed(range);
  v1.vx= v1.magnitude* cos(angle); ///global variables from structure v1
  v1.vy= v1.magnitude* sin(angle); ///global variables from structure v1
    if(angle>=0 && angle<=90){
    //  v1.vx=(+1)*v1.vx;
     // v1.vy=(+1)*v1.vy;
      v1.quadrant=1;
      }
    else if(angle>90 && angle<=180){
     // v1.vx=(-1)*v1.vx;
      // v1.vy=(+1)*v1.vy;
      v1.quadrant=2;
      }
    else if(angle>180 && angle<=270){
      // v1.vx=(-1)*v1.vx;
      // v1.vy=(-1)*v1.vy;
      v1.quadrant=3;
    }
    else if(angle>270 && angle<=360){
      // v1.vx=(+1)*v1.vx;
      // v1.vy=(-1)*v1.vy;
      v1.quadrant=4;
    }
 }
 void get_speeds(float v_x,float v_y, float omega)
 {
  wheelSpeed.u[0]=(1/RADIUS)*((v_y+v_x)-(LEN-WID)*omega);
  wheelSpeed.u[1]=(1/RADIUS)*((v_y-v_x)+(LEN-WID)*omega);
  wheelSpeed.u[2]=(1/RADIUS)*((v_y-v_x)-(LEN-WID)*omega);
  wheelSpeed.u[3]=(1/RADIUS)*((v_y+v_x)+(LEN-WID)*omega);
 }
 /****caculates the duty cycle by mapping a given value from range of 0-100****/
 void calculate_dutycycle(){
    wheelSpeed.dutyCycle[0]= map(wheelSpeed.u[0], -5, 5, 130, 255);
    wheelSpeed.dutyCycle[1]= map(wheelSpeed.u[1], -5, 5, 130, 255);
    wheelSpeed.dutyCycle[2]= map(wheelSpeed.u[2], -5, 5, 130, 255);
    wheelSpeed.dutyCycle[3]= map(wheelSpeed.u[3], -5, 5, 130, 255);
     
 }
 /** DEMO FUNCTION TO RUN MOTORS **/
 void run_motors(){
  if(v1.quadrant==1 || v1.quadrant==4){ ///for quadrant 1 & 4
   digitalWrite(motor1A, HIGH); digitalWrite(motor1B, LOW);
   digitalWrite(motor2A, HIGH); digitalWrite(motor2B, LOW);
   digitalWrite(motor3A, LOW); digitalWrite(motor3B, HIGH);
   digitalWrite(motor4A, LOW); digitalWrite(motor4B, HIGH);
 }
 
  if(v1.quadrant==2 || v1.quadrant==3) {///for quadrant 1 & 4
   digitalWrite(motor1A, LOW); digitalWrite(motor1B, HIGH);
   digitalWrite(motor2A, LOW); digitalWrite(motor2B, HIGH);
   digitalWrite(motor3A, HIGH); digitalWrite(motor3B, LOW);
   digitalWrite(motor4A, HIGH); digitalWrite(motor4B, LOW);
  }
 }
