function showCodeArd() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    let code = Blockly.JavaScript.workspaceToCode(workspace);
    let codeJSON = JSON.parse(code);
    let index = codeJSON.commands.indexOf("end");
    let arduinoCodeMain = '';
    let arduinoCodeLoop = '';

    codeJSON.commands.splice(index, 1);
    console.log(codeJSON.commands);
    
    for(let i = 0; i<codeJSON.commands.length; i++){
        console.log(codeJSON.commands);
        if(codeJSON.commands[i] == 'forward' || codeJSON.commands[i] == 'backward' || codeJSON.commands[i] == 'stop' || codeJSON.commands[i].includes("/angle") || codeJSON.commands[i].includes("/speed")){
            arduinoCodeMain = `const int motor1A 10; const int motor1B 11;
                                const int motor2A 12; const int motor2B 13;
                                const int motor3A 14; const int motor3B 15;
                                const int motor4A 16; const int motor4B 17;

                                pinMode(motor1A, OUTPUT); pinMode(motor1B, OUTPUT);
                                pinMode(motor2A, OUTPUT); pinMode(motor2B, OUTPUT);
                                pinMode(motor3A, OUTPUT); pinMode(motor3B, OUTPUT);
                                pinMode(motor4A, OUTPUT); pinMode(motor4B, OUTPUT);`;
            
            switch(codeJSON.commands[i]){
                case 'forward': 
                    arduinoCodeLoop += `digitalWrite(motor1A, HIGH); digitalWrite(motor1B, LOW);
                                        digitalWrite(motor1A, HIGH); digitalWrite(motor1B, LOW);
                                        digitalWrite(motor1A, HIGH); digitalWrite(motor1B, LOW);
                                        digitalWrite(motor1A, HIGH); digitalWrite(motor1B, LOW);`;
                    break;
                case 'stop':
                    arduinoCodeLoop += `digitalWrite(motor1A, LOW); digitalWrite(motor1B, LOW);
                                        digitalWrite(motor1A, LOW); digitalWrite(motor1B, LOW);
                                        digitalWrite(motor1A, LOW); digitalWrite(motor1B, LOW);
                                        digitalWrite(motor1A, LOW); digitalWrite(motor1B, LOW);`;
            }
            console.log(arduinoCodeMain);
            console.log(arduinoCodeLoop);
        }
    }
    document.getElementsByClassName('arduinoCodeMain')[0].innerHTML = arduinoCodeMain;
    document.getElementById('arduinoCodeLoop').innerHTML = arduinoCodeLoop;
}