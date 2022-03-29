#include <WiFi.h>
#include <HTTPClient.h>
#include <math.h>
#define LEN 5.5  
#define WID 11
#define RADIUS 4
  const char* ssid = "Humara robot";
  const char* password = "ameen123"; 
  WiFiServer server(80);
const int ledPin = 16;  // 16 corresponds to GPIO16
// setting PWM properties
int noBatch=0; //number of commands in one batch 
const int freq = 5000;
const int ledChannel1A = 0;
const int ledChannel1B = 2;
const int ledChannel2A = 4;
const int ledChannel2B = 6;
const int ledChannel3A = 8;
const int ledChannel3B = 10;
const int ledChannel4A = 12;
const int ledChannel4B = 14;
const int resolution = 8;
String LL1_command;
/**linked list**/
struct Node {
    String Data;
    Node* temp;
};
struct Node *front1 = NULL;
struct Node *rear1 = NULL;
struct Node *front2 = NULL;
struct Node *rear2 = NULL;
struct kinematics{
double vx;
double vy;
double magnitude;
int quadrant;
}v1;
struct speed_of_wheels{
  double u[4];
  int dutyCycle[4];
}wheelSpeed;
// Variable to store the HTTP request
String header;
// pins on which PWM signal is generated
const int motor3A = 19;
const int motor3B = 18;
const int motor1A = 5;
const int motor1B = 17;
const int motor2A = 16;
const int motor2B = 4;
const int motor4A = 0;
const int motor4B = 2;
String commands[20]; 
String newMainstring[20];
int i=0, idx = 0;
float _speed;
String a1 = "00";
String a2 = "000";
String a3 = "000";
String loopString = "0";
int noOfiterations=0;
int indexEndloop = 0; //index of end_loop command in array
int indexloop = 0; //index of start of the loop command in array
String serverPath; //server path name+ port for posting the requests 
int duty_cycle;
void routine_calls(int x);
void command_handler(int x);
String serverName = "http://192.168.4.2:3000/";
void setup() {
  Serial.begin(119200);
  // Initialize the output variables as outputs
  pinMode(motor1A, OUTPUT); pinMode(motor1B, OUTPUT);
  pinMode(motor2A, OUTPUT); pinMode(motor2B, OUTPUT);
  pinMode(motor3A, OUTPUT); pinMode(motor3B, OUTPUT);
  pinMode(motor4A, OUTPUT); pinMode(motor4B, OUTPUT);
  ledcSetup(ledChannel1A, freq, resolution);
  ledcSetup(ledChannel1B, freq, resolution);
  ledcSetup(ledChannel2A, freq, resolution);
  ledcSetup(ledChannel2B, freq, resolution);
  ledcSetup(ledChannel3A, freq, resolution);
  ledcSetup(ledChannel3B, freq, resolution);
  ledcSetup(ledChannel4A, freq, resolution);
  ledcSetup(ledChannel4B, freq, resolution);
  // assigning channels to pins 
  ledcAttachPin(motor1A, ledChannel1A);
  ledcAttachPin(motor1B, ledChannel1B);
  ledcAttachPin(motor2A, ledChannel2A);
  ledcAttachPin(motor2B, ledChannel2B);
  ledcAttachPin(motor3A, ledChannel3A);
  ledcAttachPin(motor3B, ledChannel3B);
  ledcAttachPin(motor4A, ledChannel4A);
  ledcAttachPin(motor4B, ledChannel4B);
  // Connect to Wi-Fi network with SSID and password
  WiFi.softAP(ssid, password);
  IPAddress IP = WiFi.softAPIP();
  Serial.print("IP");
  Serial.println(IP);
  server.begin();
 /* WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  // Print local IP address and start web server
  Serial.println("");
  Serial.println("WiFi connected.");
  Serial.println("IP address: ");
  Serial.println(WiFi.localIP());
  server.begin();*/
  /// functions call for specific angle

}

void loop(){
  if(noBatch<=0){
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
            if(header.indexOf("GET /loop")>=0){
              Enqueue(&front1,&rear1,"loop");
              Serial.println("this is the index of loop");
              indexloop=i;
              Serial.println(indexloop);
              i++;
              int l= header.indexOf("-");
                loopString.setCharAt(0, header[l+1]);
                noOfiterations=loopString.toInt();
                Serial.println(" here are iterations of the loop");
                Serial.println(noOfiterations);
            }
            else if (header.indexOf("GET /start") >= 0) {
             Enqueue(&front1,&rear1,"start");
             i++;
            }
            else if (header.indexOf("GET /forward") >= 0) {
             Enqueue(&front1,&rear1,"forward");
                    i++;
            } else if (header.indexOf("GET /stop") >= 0) {
              Enqueue(&front1,&rear1,"stop");
              i++;
            }else if (header.indexOf("GET /backward") >= 0) {
                Enqueue(&front1,&rear1,"backward");
               i++;
            } 
            else if (header.indexOf("GET /left") >= 0) {
              Enqueue(&front1,&rear1,"left");  
              i++;              
            }
            if (header.indexOf("GET /right") >= 0) {
              Enqueue(&front1,&rear1,"right");     
              i++;             
            }else if (header.indexOf("GET /delay") >= 0){  
              int d= header.indexOf("-");
               Enqueue(&front1,&rear1,"delay");
              i++;
                a1.setCharAt(0, header[d+1]);
                a1.setCharAt(1, header[d+2]);
            }
            else if (header.indexOf("GET /angle") >= 0){  
              int e= header.indexOf("-");
               Enqueue(&front1,&rear1,"angle");
              i++;
                a2.setCharAt(0, header[e+1]);
                a2.setCharAt(1, header[e+2]);
                a2.setCharAt(2, header[e+3]);
                
            }
             else if (header.indexOf("GET /speed") >= 0){  
              int s= header.indexOf("-");
             Enqueue(&front1,&rear1,"speed");
              i++;
                a3.setCharAt(0, header[s+1]);
                a3.setCharAt(1, header[s+2]);
                a3.setCharAt(2, header[s+3]);   
            }
            else if(header.indexOf("GET /endloop")>=0){
                Enqueue(&front1,&rear1,"endloop");
                Serial.println("this is the index of endloop");
                indexEndloop=i;
                Serial.println(indexEndloop);
                i++;
               }
            else if(header.indexOf("GET /final")>=0){
              noBatch+=1;
                ///displayQueue();
                postRequest("ack");
                Enqueue(&front1,&rear1,"final");
                Serial.println("hi, I am displayQueue of linked list 1");
                displayQueue(&front1,&rear1);
                command_handler();
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
}
    void postRequest(String req){
     HTTPClient http;
     serverPath = serverName + req;
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
  void command_handler()
  {
    int totalComm=0; //total number of commands in one batch
    int s=0;
    Dequeue(&front1,&rear1);
    LL1_command= Dequeue(&front1,&rear1);
    while(LL1_command!="final")
    {
    
     if(LL1_command=="loop")
     {
       int sizeOfLoop=(indexEndloop-indexloop);
       Serial.println("sizeOfLoop");
       Serial.println(sizeOfLoop);
       String TempArray[sizeOfLoop]; 
       LL1_command= Dequeue(&front1,&rear1);
       while(LL1_command!="endloop")
       {
        TempArray[s]= LL1_command;
        s+=1;
        LL1_command= Dequeue(&front1,&rear1);
       }
       for(int i=0; i<noOfiterations; i++)
       {
        for(int j=0; j<sizeOfLoop; j++)
        {
          Enqueue(&front2,&rear2,TempArray[j]);
          totalComm++;
        }
       }
     }
     else
     {
      Enqueue(&front2,&rear2,LL1_command);
      totalComm++;
     }
      LL1_command= Dequeue(&front1,&rear1);
    }
   displayQueue(&front2,&rear2);
   for(int l=0; l<totalComm; l++)
    {
      LL1_command= Dequeue(&front2,&rear2);
      if (LL1_command == "forward") {
                   routine_calls(90);
            } else if (LL1_command == "stop") {
              ledcWrite(ledChannel1A, 255);  ledcWrite(ledChannel1B, 255);
              ledcWrite(ledChannel2A, 255);  ledcWrite(ledChannel2B, 255);
              ledcWrite(ledChannel3A, 255);  ledcWrite(ledChannel3B, 255);
              ledcWrite(ledChannel4A, 255);  ledcWrite(ledChannel4B, 255); 
            }else if (LL1_command == "backward") {
               routine_calls(180);
            } 
            else if (LL1_command == "left") {
              digitalWrite(motor1A, HIGH); digitalWrite(motor1B, LOW);
              digitalWrite(motor2A, HIGH); digitalWrite(motor2B, LOW);
              digitalWrite(motor3A, LOW); digitalWrite(motor3B, HIGH);
              digitalWrite(motor4A, LOW); digitalWrite(motor4B, HIGH);                 
            }
            if (LL1_command == "right") {
              digitalWrite(motor1A, LOW); digitalWrite(motor1B, HIGH);
              digitalWrite(motor2A, LOW); digitalWrite(motor2B, HIGH);
              digitalWrite(motor3A, HIGH); digitalWrite(motor3B, LOW);
              digitalWrite(motor4A, HIGH); digitalWrite(motor4B, LOW);                 
            }
            if (LL1_command == "delay"){
                int x=a1.toInt();                               
              delay(x*1000);
            }
            if(LL1_command == "angle"){
               int ang=a2.toInt();  
              routine_calls(ang);
            }
            if(LL1_command == "speed"){
               _speed=(0.62 * a3.toInt())/100;  //0.62= linear velocity of robot calculated by rpm
             
            }
    }
    postRequest("free");
    noBatch-=1;
  }

  /** calculates the linear velocity of robot by specific range given by user***/
 /**float get_speed(float range){ 
    _speed = (0.62 * range)/100; 
    return _speed;
 }***/
 void get_components( int angle){
  v1.magnitude= _speed;
  float rad_angle=angle*(3.1415/180);
  v1.vx= v1.magnitude* cos(rad_angle); ///global variables from structure v1
  v1.vy= v1.magnitude* sin(rad_angle); ///global variables from structure v1
 }
 void get_speeds(float v_x,float v_y, float omega)
 {
  wheelSpeed.u[1]=abs((0.25)*(((v_y+v_x)*100)-(LEN-WID)*omega)); // w1
  wheelSpeed.u[0]=abs((0.25)*(((v_y-v_x)*100)+(LEN-WID)*omega)); // w2
  wheelSpeed.u[2]=abs((0.25)*(((v_y-v_x)*100)-(LEN-WID)*omega)); // w3
  wheelSpeed.u[3]=abs((0.25)*(((v_y+v_x)*100)+(LEN-WID)*omega)); // w4
 }
 /****caculates the duty cycle by mapping a given value from range of 0-100****/
 void calculate_dutycycle(){
  float maximum_speed=find_max();
  float min_speed=maximum_speed/2;
        int randommax= map(a3.toInt(),0,100, 130, 255);
       /// int randommin= map(a3.toInt(),0,100, 0, 80);
        wheelSpeed.dutyCycle[0]= map(wheelSpeed.u[1], -maximum_speed, maximum_speed, 0, randommax);
        wheelSpeed.dutyCycle[1]= map(wheelSpeed.u[0], -maximum_speed, maximum_speed, 0, randommax);
        wheelSpeed.dutyCycle[2]= map(wheelSpeed.u[2], -maximum_speed, maximum_speed, 0, randommax);
        wheelSpeed.dutyCycle[3]= map(wheelSpeed.u[3], -maximum_speed, maximum_speed, 0, randommax);
     
 }
 float find_max(){
  float max_v = wheelSpeed.u[0];
  for(int i=0;i<4;i++){
    if(wheelSpeed.u[i] > max_v)
      max_v = wheelSpeed.u[i];
  }
  return max_v;
 }
 void routine_calls(int x){
    get_components(x);
    get_speeds(v1.vx, v1.vy, 0);
    calculate_dutycycle();
    run_motors(x);
 }
 /** DEMO FUNCTION TO RUN MOTORS **/
 void run_motors(float an){
   if(an==0){
     ledcWrite(ledChannel1B, wheelSpeed.dutyCycle[0]);  ledcWrite(ledChannel1A, 0);
    ledcWrite(ledChannel2A, wheelSpeed.dutyCycle[1]);  ledcWrite(ledChannel2B, 0);
    ledcWrite(ledChannel3A, wheelSpeed.dutyCycle[2]);  ledcWrite(ledChannel3B, 0);
    ledcWrite(ledChannel4B, wheelSpeed.dutyCycle[3]);  ledcWrite(ledChannel4A, 0); 
   }
  if(an>0 && an<180){ ///for quadrant 1 & 4
    ledcWrite(ledChannel2A, wheelSpeed.dutyCycle[0]);  ledcWrite(ledChannel2B, 0);
    ledcWrite(ledChannel1A, wheelSpeed.dutyCycle[1]);  ledcWrite(ledChannel1B, 0);
    ledcWrite(ledChannel4A, wheelSpeed.dutyCycle[2]);  ledcWrite(ledChannel4B, 0);
    ledcWrite(ledChannel3A, wheelSpeed.dutyCycle[3]);  ledcWrite(ledChannel3B, 0); 
 }
  if(an==180){
     ledcWrite(ledChannel1A, wheelSpeed.dutyCycle[0]);  ledcWrite(ledChannel1B, 0);
    ledcWrite(ledChannel2B, wheelSpeed.dutyCycle[1]);  ledcWrite(ledChannel2A, 0);
    ledcWrite(ledChannel3B, wheelSpeed.dutyCycle[2]);  ledcWrite(ledChannel3A, 0);
    ledcWrite(ledChannel4A, wheelSpeed.dutyCycle[3]);  ledcWrite(ledChannel4B, 0); 
   }
 
  if(an>180) {///for quadrant 1 & 4
   ledcWrite(ledChannel2A, 0); ledcWrite(ledChannel2B, wheelSpeed.dutyCycle[0]);
   ledcWrite(ledChannel1A, 0); ledcWrite(ledChannel1B, wheelSpeed.dutyCycle[1]);
   ledcWrite(ledChannel4A, 0);    ledcWrite(ledChannel4B, wheelSpeed.dutyCycle[2]);
   ledcWrite(ledChannel3A, 0);  ledcWrite(ledChannel3B, wheelSpeed.dutyCycle[3]); 
 } 
 }
 // Function to insert node
void Enqueue ( struct Node **front,struct Node **rear, String value )
{
 Node *ptr = new Node();
 ptr->Data= value;
 ptr->temp = NULL;

 //If inserting the first element/node
 if( *front == NULL )
 {
  *front = ptr;
  *rear = ptr;
 }
 else
 {
  (*rear)->temp = ptr;
  *rear = ptr;
 }
}
String Dequeue(struct Node **front,struct Node **rear)
{
  String datatemp;
 if ((*front == NULL) && (*rear == NULL))
 Serial.println("queue is empty");
 if( *front == *rear)
 {
  datatemp= (*front)->Data;
  free(*front);
  return(datatemp);
  *front = *rear = NULL;
 }
 else
 {
  Node *ptr = *front;
  *front = (*front)->temp;
  datatemp= ptr->Data;
  free(ptr);
  return(datatemp);
 }
}

void displayQueue(struct Node **front,struct Node **rear)
{
 if ((*front == NULL) && (*rear == NULL))
  Serial.println("queue is empty");
 else
 {
  Node *ptr = *front;
  while( ptr !=NULL)
  {
   Serial.println(ptr->Data);
   ptr= ptr->temp;
  }
 }
}
