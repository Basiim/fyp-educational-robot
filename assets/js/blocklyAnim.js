/*************************************************************************************
 * 
 * 
 * Title: Blockly Animation
 * 
 * Version: 0.2
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

let robot = {
    Vx: 0,
    Vy: 0,
    omega: 0,
    U: [],
    len: 5.5,
    wid: 11
}

let animate = (x = 0, y = 0, time) => {
    console.log(time);
    tl.to('.anim', { x: x, y: y, duration: time });
}

let simulate = () => {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    let code = Blockly.JavaScript.workspaceToCode(workspace);
    let codeJSON;
    code = code.split(';');
    if (code[1])
        codeJSON = JSON.parse(code[1]);
    else
        codeJSON = JSON.parse(code[0]);
    let index = codeJSON.commands.indexOf("end");
    codeJSON.commands.splice(index, 1);
    let posX = 0, posY = 0, time = 0;
    let currentCommand = '', angle = 0, radAngle = 0;
    let speed = 0, speedMapped;
    let delay = 0;
    animate(posX, posY, 0);
    setTimeout(function () {
        for (let i = 0; i < codeJSON.commands.length; i++) {
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
                            currentCommand = "speed";
                            speed = codeJSON.commands[i].match(/\d+/);
                            speedMapped = (0.62 * speed) / 100;
                        } else if (codeJSON.commands[i].includes("/loop")) {
                            console.log('blabla');
                        } else if (codeJSON.commands[i].includes("/endloop")) {
                            console.log('blabla');
                        } else if (codeJSON.commands[i].includes("/delay")) { // Delay
                            delay = codeJSON.commands[i].match(/\d+/);
                            //console.log('Delay: ' + codeJSON.commands[i]);
                            if (currentCommand == '')
                                break
                            else {
                                if (currentCommand == "forward") {
                                    posY += speed * -(1);
                                    time = delay;
                                }
                                if (currentCommand == "backward") {
                                    posY += speed * (1);
                                    time = delay;
                                }
                                if (currentCommand == "angle") {
                                    console.log(speed);
                                    posY += speed * -Math.sin(radAngle); // Distance * sin(angle)
                                    posX += speed * Math.cos(radAngle);
                                    time = delay;
                                }
                            }
                        }
                        calculateSpeeds(speedMapped, radAngle);
                        animate(posX, posY, time);
                        time = 0;
                    }
            }
        }
    }, 1000);
}

let calculateSpeeds = (magnitude, radAngle) => {
    // Calculating X and Y components
    robot.Vx = magnitude * Math.cos(radAngle);
    robot.Vy = magnitude * Math.sin(radAngle);

    // Calculating Individual Wheel speed (Inverse Kinematics)
    robot.U[0] = Math.abs((0.25) * (((robot.Vy - robot.Vx) * 100) + (robot.len - robot.wid) * robot.omega));
    robot.U[1] = Math.abs((0.25) * (((robot.Vy + robot.Vx) * 100) - (robot.len - robot.wid) * robot.omega));
    robot.U[2] = Math.abs((0.25) * (((robot.Vy - robot.Vx) * 100) - (robot.len - robot.wid) * robot.omega));
    robot.U[3] = Math.abs((0.25) * (((robot.Vy + robot.Vx) * 100) + (robot.len - robot.wid) * robot.omega));

    //document.getElementById('speeds').innerText = `Wheel1: ${robot.U[0]} Wheel2: ${robot.U[1]} Wheel3: ${robot.U[2]} Wheel4: ${robot.U[3]}`;
    console.log(`
        Wheel1: ${robot.U[0]}
        Wheel2: ${robot.U[1]} 
        Wheel3: ${robot.U[2]} 
        Wheel4: ${robot.U[3]}
    `);
}