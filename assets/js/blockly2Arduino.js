/*************************************************************************************
 * 
 * 
 * Title: blockly2Arduino
 * 
 * Version: 0.1
 * 
 * Path: /assets/js/blockly2Arduino.js
 * 
 * Authors: Basim Abdullah Tariq
 *          Muhammad Talha Sajjad
 * 
 * Description: This file contains the functions that converts blocks into arduino
 *              code. It is to be noted that this code is arbitrary and may change 
 *              based on the shape, size and the orientation of the robot.
 * 
 * Refrence(s):
 * 
 * 
 *************************************************************************************/
let showCodeArd = () => {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    let code = Blockly.JavaScript.workspaceToCode(workspace);
    let codeJSON = JSON.parse(code);
    let index = codeJSON.commands.indexOf("end");
    let arduinoCodeMain = '';
    let arduinoCodeLoop = '';
    let speed, speedMapped;
    let angle, radAngle;
    let vx = 0, vy = 0, omega = 0;
    let u = [], dutyCycle = [];

    codeJSON.commands.splice(index, 1);
    
    for (let i = 0; i < codeJSON.commands.length; i++){
        if(codeJSON.commands[i] == 'forward' || codeJSON.commands[i] == 'backward' || codeJSON.commands[i] == 'stop' || codeJSON.commands[i].includes("/angle") || codeJSON.commands[i].includes("/speed")){
            arduinoCodeMain = `
                    /** Motor control pins **/
                    const int motor1A 10; const int motor1B 11;
                    const int motor2A 12; const int motor2B 13;
                    const int motor3A 14; const int motor3B 15;
                    const int motor4A 16; const int motor4B 17;

                    /** PWM Pins **/
                    const int PWM1 18; const int PWM2 19;
                    const int PWM3 20; const int PWM4 21;

                    pinMode(motor1A, OUTPUT); pinMode(motor1B, OUTPUT);
                    pinMode(motor2A, OUTPUT); pinMode(motor2B, OUTPUT);
                    pinMode(motor3A, OUTPUT); pinMode(motor3B, OUTPUT);
                    pinMode(motor4A, OUTPUT); pinMode(motor4B, OUTPUT);
                    pinMode(PWM1, OUTPUT); pinMode(PWM2, OUTPUT);
                    pinMode(PWM3, OUTPUT); pinMode(PWM4, OUTPUT);`;
            
            switch(codeJSON.commands[i]){
                case 'forward': 
                    arduinoCodeLoop += `
                    /** Move Forward **/
                    digitalWrite(motor1A, HIGH); digitalWrite(motor1B, LOW);
                    digitalWrite(motor2A, HIGH); digitalWrite(motor2B, LOW);
                    digitalWrite(motor3A, HIGH); digitalWrite(motor3B, LOW);
                    digitalWrite(motor4A, HIGH); digitalWrite(motor4B, LOW);
                    analogWrite(PWM1, ${speedMapped});
                    analogWrite(PWM2, ${speedMapped});
                    analogWrite(PWM3, ${speedMapped});
                    analogWrite(PWM4, ${speedMapped});`;
                    break;
                case 'backward': 
                    arduinoCodeLoop += `
                    /** Move Backward **/
                    digitalWrite(motor1A, LOW); digitalWrite(motor1B, HIGH;
                    digitalWrite(motor2A, LOW); digitalWrite(motor2B, HIGH);
                    digitalWrite(motor3A, LOW); digitalWrite(motor3B, HIGH);
                    digitalWrite(motor4A, LOW); digitalWrite(motor4B, HIGH);
                    analogWrite(PWM1, ${speedMapped});
                    analogWrite(PWM2, ${speedMapped});
                    analogWrite(PWM3, ${speedMapped});
                    analogWrite(PWM4, ${speedMapped});`;
                    break;
                case 'stop':
                    arduinoCodeLoop += `
                    /** Stop movement **/
                    analogWrite(motor1A, 0); analogWrite(motor1B, 0);
                    analogWrite(motor1A, 0); analogWrite(motor1B, 0);
                    analogWrite(motor1A, 0); analogWrite(motor1B, 0);
                    analogWrite(motor1A, 0); analogWrite(motor1B, 0);`;
                    break;
                default:
                    if (codeJSON.commands[i].includes("/angle")) {
                        console.log(codeJSON.commands[i].match(/\d+/));
                        angle = codeJSON.commands[i].match(/\d+/);
                        radAngle = angle * (3.1415 / 180);
                        console.log(speedMapped);
                        // X and Y components
                        vx = speedMapped * Math.cos(radAngle);
                        vy = speedMapped * Math.sin(radAngle);

                        // Speeds
                        u[0] = Math.abs((0.25) * (((vy - vx) * 100) + (5.5 - 11) * omega));
                        u[1] = Math.abs((0.25) * (((vy + vx) * 100) - (5.5 - 11) * omega));
                        u[2] = Math.abs((0.25) * (((vy - vx) * 100) - (5.5 - 11) * omega));
                        u[3] = Math.abs((0.25) * (((vy + vx) * 100) + (5.5 - 11) * omega));
                        console.log(u[0]);
                        console.log(u[1]);
                        console.log(u[2]);
                        console.log(u[3]);
                        // Max speed
                        let maxSpeed = u[0];
                        for (let i = 0; i < 4; i++)
                            if (u[i] > maxSpeed)
                                maxSpeed = u[i];
                        
                        let outMax = 255, outMin = 130;
                        let outMaxMapped, outMinMapped = 0;
                        outMaxMapped = (speedMapped - 0) * (outMax - outMin)/(100-0)+outMin;
                        
                        // Duty Cycles
                        dutyCycle[0] = (u[0] - (-maxSpeed)) * (outMaxMapped - outMinMapped) / (maxSpeed - (-maxSpeed)) + outMinMapped;
                        dutyCycle[1] = (u[1] - (-maxSpeed)) * (outMaxMapped - outMinMapped) / (maxSpeed - (-maxSpeed)) + outMinMapped;
                        dutyCycle[2] = (u[2] - (-maxSpeed)) * (outMaxMapped - outMinMapped) / (maxSpeed - (-maxSpeed)) + outMinMapped;
                        dutyCycle[3] = (u[3] - (-maxSpeed)) * (outMaxMapped - outMinMapped) / (maxSpeed - (-maxSpeed)) + outMinMapped;

                        // Code
                        arduinoCodeLoop += `
                    /** Stop movement **/
                    analogWrite(motor1A, ${dutyCycle[0]}); analogWrite(motor1B, 0);
                    analogWrite(motor1A, ${dutyCycle[1]}); analogWrite(motor1B, 0);
                    analogWrite(motor1A, ${dutyCycle[2]}); analogWrite(motor1B, 0);
                    analogWrite(motor1A, ${dutyCycle[3]}); analogWrite(motor1B, 0);`;
                    }
                    if (codeJSON.commands[i].includes("/speed")) {
                        console.log(codeJSON.commands[i].match(/\d+/));
                        speed = codeJSON.commands[i].match(/\d+/);
                        let in_min = 0;
                        let in_max = 100;
                        let out_min = 130;
                        let out_max = 255;
                        if (speed == 0)
                            speedMapped = 0;
                        else
                            speedMapped = (speed - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
                    }
            }
        }
    }
    document.getElementsByClassName('arduinoCodeMain')[0].innerHTML = arduinoCodeMain;
    document.getElementById('arduinoCodeLoop').innerHTML = arduinoCodeLoop;
}