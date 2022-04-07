showCodeArd = () => {
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
                    const int motor1A 10; const int motor1B 11;
                    const int motor2A 12; const int motor2B 13;
                    const int motor3A 14; const int motor3B 15;
                    const int motor4A 16; const int motor4B 17;

                    pinMode(motor1A, OUTPUT); pinMode(motor1B, OUTPUT);
                    pinMode(motor2A, OUTPUT); pinMode(motor2B, OUTPUT);
                    pinMode(motor3A, OUTPUT); pinMode(motor3B, OUTPUT);
                    pinMode(motor4A, OUTPUT); pinMode(motor4B, OUTPUT);`;
            
            switch(codeJSON.commands[i]){
                case 'forward': 
                    arduinoCodeLoop += `
                    /** Move Forward **/
                    analogWrite(motor1A, ${speedMapped}); analogWrite(motor1B, 0);
                    analogWrite(motor1A, ${speedMapped}); analogWrite(motor1B, 0);
                    analogWrite(motor1A, ${speedMapped}); analogWrite(motor1B, 0);
                    analogWrite(motor1A, ${speedMapped}); analogWrite(motor1B, 0);`;
                    break;
                case 'backward': 
                    arduinoCodeLoop += `
                    /** Move Backward **/
                    analogWrite(motor1A, 0); analogWrite(motor1B, ${speedMapped});
                    analogWrite(motor1A, 0); analogWrite(motor1B, ${speedMapped});
                    analogWrite(motor1A, 0); analogWrite(motor1B, ${speedMapped});
                    analogWrite(motor1A, 0); analogWrite(motor1B, ${speedMapped});`;
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