 #include <WiFi.h>
  
  const char* ssid = "educational bot";
  const char* password = "123456789"; 
  
  WiFiServer server(80);

// Variable to store the HTTP request
String header;

// Assign output variables to GPIO pins
const int motor1A = 19;
const int motor1B = 21;
const int motor2A = 5;
const int motor2B = 18;
const int motor3A = 22;
const int motor3B = 23;
const int motor4A = 16;
const int motor4B = 17;
String commands[20]; 
int i=0;
String a = "00";

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

  // Connect to Wi-Fi network with SSID and password
  WiFi.softAP(ssid, password);
  IPAddress IP = WiFi.softAPIP();
  Serial.print("IP");
  Serial.println(IP);
  server.begin();
  /**Serial.print("Connecting to ");
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
  server.begin();***/
}

void loop(){
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
  }
