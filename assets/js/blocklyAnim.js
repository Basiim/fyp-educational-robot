/*************************************************************************************
 * 
 * 
 * Title: Blockly Animation
 * 
 * Version: 0.1
 * 
 * Path: /assets/js/blocklyAnim.js
 * 
 * Authors: Basim Abdullah Tariq
 *          Muhammad Talha Sajjad
 * 
 * Description: This file contains the functions that animate the simulated behaviour
 *              of the robot using GSAP library. The commands from blockly are loaded
 *              and executed accordingly using the simulator programmed below.
 * 
 * Refrence(s): https://greensock.com/docs/
 * 
 * 
 *************************************************************************************/

const tl = gsap.timeline({ defaults: { ease: "none" } });

let animate = (x = 0, y = 0, time) => {
    console.log(time);
    tl.to('.anim',{ x: x, y: y, duration: time});
}

let simulate = () => {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    let code = Blockly.JavaScript.workspaceToCode(workspace);
    let codeJSON = JSON.parse(code);
    let index = codeJSON.commands.indexOf("end");
    codeJSON.commands.splice(index, 1);
    let posX = 0, posY = 0, time = 0;
    let currentCommand = '', angle = 0, radAngle = 0;
    animate(posX, posY, 0);
    setTimeout(function () {
        for (let i = 0; i < codeJSON.commands.length; i++){
            switch (codeJSON.commands[i]) {
                case "forward":
                    currentCommand = "forward";
                    break;
                case "backward":
                    currentCommand = "backward";
                    break;
                case "stop":
                    posY = posY;
                    posX = posX;
                    animate(posX, posY, speed);
                    currentCommand = "stop"
                    break;
                default:
                    {
                        if (codeJSON.commands[i].includes("/angle")) {
                            currentCommand = "angle";
                            angle = codeJSON.commands[i].match(/\d+/);
                            radAngle = angle * (3.1415 / 180);
                        } else if (codeJSON.commands[i].includes("/speed")) {
                            console.log('blabla');
                        } else if (codeJSON.commands[i].includes("/loop")) {
                            console.log('blabla');
                        }else if (codeJSON.commands[i].includes("/endloop")) {
                            console.log('blabla');
                        } else { // Delay
                            console.log('Delay: ' + codeJSON.commands[i]);
                            if (currentCommand == '')
                                break
                            else {
                                if (currentCommand == "forward") {
                                    posY += -(codeJSON.commands[i] * 10);
                                    time = codeJSON.commands[i];
                                }
                                if (currentCommand == "backward") {
                                    posY += (codeJSON.commands[i] * 10);
                                    time = codeJSON.commands[i];
                                }
                                if (currentCommand == "angle") {
                                    posY += (codeJSON.commands[i] * 10) * -Math.sin(radAngle); // Distance * sin(angle)
                                    posX += (codeJSON.commands[i] * 10) * Math.cos(radAngle);
                                    time = codeJSON.commands[i];
                                }
                            }
                        }
                        animate(posX, posY, time);
                    }
            }
        }
    }, 1000);   
}