/*************************************************************************************
 * 
 * 
 * Title: blockly2Arduino
 * 
 * Version: 0.2
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
    let codeJSON;
    code = code.split(';');
    if (code[1])
        codeJSON = JSON.parse(code[1]);
    else
        codeJSON = JSON.parse(code[0]);
    let index = codeJSON.commands.indexOf("end");
    let arduinoCodeMain = '';
    let arduinoCodeLoop = '';
    let speed, speedMapped;
    let loopTimes;
    let delay;
    let angle, radAngle;
    let vx = 0, vy = 0, omega = 0;
    let u = [], dutyCycle = [];

    codeJSON.commands.splice(index, 1);

    for (let i = 0; i < codeJSON.commands.length; i++) {
        if (codeJSON.commands[i] == 'forward'
            || codeJSON.commands[i] == 'backward'
            || codeJSON.commands[i] == 'stop'
            || codeJSON.commands[i].includes("/angle")
            || codeJSON.commands[i].includes("/speed")
            || codeJSON.commands[i].includes('/loop')
            || codeJSON.commands[i].includes('/endloop')
            || codeJSON.commands[i].includes('/delay')) {
            arduinoCodeMain = `
                    /** Motor control pins **/
                    const int motor1A 2; const int motor1B 4;
                    const int motor2A 7; const int motor2B 8;
                    const int motor3A 10; const int motor3B 11;
                    const int motor4A 12; const int motor4B 13;

                    /** PWM Pins **/
                    const int PWM1 3; const int PWM2 5;
                    const int PWM3 6; const int PWM4 9;

                    pinMode(motor1A, OUTPUT); pinMode(motor1B, OUTPUT);
                    pinMode(motor2A, OUTPUT); pinMode(motor2B, OUTPUT);
                    pinMode(motor3A, OUTPUT); pinMode(motor3B, OUTPUT);
                    pinMode(motor4A, OUTPUT); pinMode(motor4B, OUTPUT);
                    pinMode(PWM1, OUTPUT); pinMode(PWM2, OUTPUT);
                    pinMode(PWM3, OUTPUT); pinMode(PWM4, OUTPUT);`;

            switch (codeJSON.commands[i]) {
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
                        console.log(speed);
                        // X and Y components
                        vx = ((0.62 * speed) / 100) * Math.cos(radAngle);
                        vy = ((0.62 * speed) / 100) * Math.sin(radAngle);

                        // Speeds
                        u[0] = Math.abs((0.25) * (((vy - vx) * 100) + (5.5 - 11) * omega));
                        u[1] = Math.abs((0.25) * (((vy + vx) * 100) - (5.5 - 11) * omega));
                        u[2] = Math.abs((0.25) * (((vy - vx) * 100) - (5.5 - 11) * omega));
                        u[3] = Math.abs((0.25) * (((vy + vx) * 100) + (5.5 - 11) * omega));
                        // Max speed
                        let maxSpeed = u[0];
                        for (let i = 0; i < 4; i++)
                            if (u[i] > maxSpeed)
                                maxSpeed = u[i];

                        // Duty Cycles
                        dutyCycle[0] = map(u[0], -maxSpeed, maxSpeed, 0, speedMapped);
                        dutyCycle[1] = map(u[1], -maxSpeed, maxSpeed, 0, speedMapped);
                        dutyCycle[2] = map(u[2], -maxSpeed, maxSpeed, 0, speedMapped);
                        dutyCycle[3] = map(u[3], -maxSpeed, maxSpeed, 0, speedMapped);

                        // Code
                        if (angle == 0) {
                            arduinoCodeLoop += `
                    /** Move at angle ${angle} degrees **/
                    analogWrite(motor1A, 0); analogWrite(motor1B, ${dutyCycle[0].toFixed(2)});
                    analogWrite(motor2A, ${dutyCycle[1].toFixed(2)}); analogWrite(motor2B, 0);
                    analogWrite(motor3A, ${dutyCycle[2].toFixed(2)}); analogWrite(motor3B, 0);
                    analogWrite(motor4A, 0); analogWrite(motor4B, ${dutyCycle[3].toFixed(2)});`;
                        }
                        if (angle > 0 && angle < 180) {
                            arduinoCodeLoop += `
                    /** Move at angle ${angle} degrees **/
                    analogWrite(motor1A, ${dutyCycle[0].toFixed(2)}); analogWrite(motor1B, 0);
                    analogWrite(motor2A, ${dutyCycle[1].toFixed(2)}); analogWrite(motor2B, 0);
                    analogWrite(motor3A, ${dutyCycle[2].toFixed(2)}); analogWrite(motor3B, 0);
                    analogWrite(motor4A, ${dutyCycle[3].toFixed(2)}); analogWrite(motor4B, 0);`;
                        }
                        if (angle == 180) {
                            arduinoCodeLoop += `
                    /** Move at angle ${angle} degrees **/
                    analogWrite(motor1A, ${dutyCycle[0].toFixed(2)}); analogWrite(motor1B, 0);
                    analogWrite(motor2A, 0); analogWrite(motor2B, ${dutyCycle[1].toFixed(2)});
                    analogWrite(motor3A, 0); analogWrite(motor3B, ${dutyCycle[2].toFixed(2)});
                    analogWrite(motor4A, ${dutyCycle[3].toFixed(2)}); analogWrite(motor4B, 0);`;
                        }
                        if (angle > 180) {
                            arduinoCodeLoop += `
                    /** Move at angle ${angle} degrees **/
                    analogWrite(motor1A, 0); analogWrite(motor1B, ${dutyCycle[0].toFixed(2)});
                    analogWrite(motor2A, 0); analogWrite(motor2B, ${dutyCycle[1].toFixed(2)});
                    analogWrite(motor3A, 0); analogWrite(motor3B, ${dutyCycle[2].toFixed(2)});
                    analogWrite(motor4A, 0); analogWrite(motor4B, ${dutyCycle[3].toFixed(2)});`;
                        }
                    }
                    if (codeJSON.commands[i].includes("/speed")) {
                        console.log(codeJSON.commands[i].match(/\d+/));
                        speed = codeJSON.commands[i].match(/\d+/);
                        if (speed == 0)
                            speedMapped = 0;
                        else
                            speedMapped = map(speed, 0, 100, 130, 255);
                    }
                    if (codeJSON.commands[i].includes("/loop")) {
                        loopTimes = codeJSON.commands[i].match(/\d+/);
                        console.log(codeJSON.commands[i]);
                        arduinoCodeLoop += `
                    /** Loop ${loopTimes} times **/
                    for(int i = 0; i < ${loopTimes}; i++) {`;
                    }
                    if (codeJSON.commands[i].includes("/endloop")) {
                        loopTimes = codeJSON.commands[i].match(/\d+/);
                        arduinoCodeLoop += `
                    }
                    /** Loop End **/`;
                    }
                    if (codeJSON.commands[i].includes("/delay")) {
                        delay = codeJSON.commands[i].match(/\d+/);
                        arduinoCodeLoop += `
                    /** Wait ${delay} seconds **/
                    delay(${delay}*1000)`;
                    }
                // TODO functions, conditions
            }
        }
    }
    document.getElementsByClassName('arduinoCodeMain')[0].innerHTML = arduinoCodeMain;
    document.getElementById('arduinoCodeLoop').innerHTML = arduinoCodeLoop;
}
let map = (value, x1, y1, x2, y2) => (value - x1) * (y2 - x2) / (y1 - x1) + x2;