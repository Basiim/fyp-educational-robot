/*************************************************************************************
 * 
 * 
 * Title: Buttons Behaviour
 * 
 * Version: 0.2
 * 
 * Path: /assets/js/buttonBehaviour.js
 * 
 * Authors: Basim Abdullah Tariq
 *          Muhammad Talha Sajjad
 * 
 * Description: This file contains the functions that are used to perform various 
 *              tasks in the app. These functions are linked to the button on the 
 *              app.
 * 
 * Refrence(s): 
 * 
 * 
 *************************************************************************************/
let rangeSensor = 0;
let imu = {
    "accelerometer": 0,
    "gyroscope": 0,
    "magnetometer": 0
}
let saveIP = () => {
    ip = document.getElementById('ipAdd').value;
    document.getElementById('curIP').innerHTML = ip;
}
let showCode = () => {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    let code = Blockly.JavaScript.workspaceToCode(workspace);
    let codeJSON;
    //code = code.substring(0, code.indexOf(";"));
    code = code.split(';');
    if (code[1])
        codeJSON = JSON.parse(code[1]);
    else
        codeJSON = JSON.parse(code[0]);
    let index = codeJSON.commands.indexOf("end");
    codeJSON.commands.splice(index, 1);
    for (let i = 0; i < codeJSON.commands.length; i++) {
        switch (codeJSON.commands[i]) {
            case "forward":
                document.getElementById('cmds').innerHTML += codeJSON.commands[i];
                break;
            case "backward":
                document.getElementById('cmds').innerHTML += codeJSON.commands[i];
                break;
            case "stop":
                document.getElementById('cmds').innerHTML += codeJSON.commands[i];
                break;
            default:
                {
                    if (codeJSON.commands[i].includes("/angle")) {
                        let angle = codeJSON.commands[i].match(/\d+/);
                        document.getElementById('cmds').innerHTML += `Angle ${angle} degrees`;
                    } else if (codeJSON.commands[i].includes("/speed")) {
                        let speed = codeJSON.commands[i].match(/\d+/);
                        document.getElementById('cmds').innerHTML += `Speed ${speed}`;
                    }
                    else if (codeJSON.commands[i].includes("/loop")) {
                        break; // ignore
                        //url = url + codeJSON.commands[i];
                    } else if (codeJSON.commands[i].includes("/endloop")) {
                        break; // ignore
                        //url = url + codeJSON.commands[i];
                    } else if (codeJSON.commands[i].includes("/delay")) {
                        let delay = codeJSON.commands[i].match(/\d+/);
                        document.getElementById('cmds').innerHTML += `Delay ${delay} seconds`;
                    } else if (codeJSON.commands[i].includes("/var")) {
                        let vari = codeJSON.commands[i].match(/\d+/);
                        document.getElementById('cmds').innerHTML += `Delay ${delay} seconds`;
                    }
                    sendReq(url);
                }
        }
        document.getElementById('cmds').innerHTML += "<br>";
    }
}
let runCode = () => {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    let code = Blockly.JavaScript.workspaceToCode(workspace);
    let codeJSON;
    //code = code.substring(0, code.indexOf(";"));
    code = code.split(';');
    if (code[1])
        codeJSON = JSON.parse(code[1]);
    else
        codeJSON = JSON.parse(code[0]);
    let len = codeJSON.commands.length;
    console.log(codeJSON);
    let url = "http://" + ip;
    for (let i = 0; i < len; i++) {
        switch (codeJSON.commands[i]) {
            case "forward":
                url = url + "/forward";
                sendReq(url);
                break;
            case "backward":
                url = url + "/backward";
                sendReq(url);
                break;
            case "!":
                url = url + "/final";
                sendReq(url);
                break;
            case "~":
                url = url + "/start";
                sendReq(url);
                break;
            case "stop":
                url = url + "/stop";
                sendReq(url);
                break;
            default:
                {
                    if (codeJSON.commands[i].includes("/angle")) {
                        url = url + codeJSON.commands[i];
                    } else if (codeJSON.commands[i].includes("/speed")) {
                        url = url + codeJSON.commands[i];
                        console.log(codeJSON.commands[i]);
                    }
                    else if (codeJSON.commands[i].includes("/loop")) {
                        break; // ignore
                        //url = url + codeJSON.commands[i];
                    } else if (codeJSON.commands[i].includes("/endloop")) {
                        break; // ignore
                        //url = url + codeJSON.commands[i];
                    } else if (codeJSON.commands[i].includes("/delay")) {
                        url = url + `${codeJSON.commands[i]}`;
                    }
                    sendReq(url);
                }
        }
        url = "http://" + ip;
    }
}
// TODO add response for fetch function
let sendReq = url => fetch(url, { method: 'GET', mode: 'no-cors' })
let saveCode = () => {
    let xmlCode = Blockly.Xml.workspaceToDom(workspace);
    let xmlDoc = '<xml>' + xmlCode.innerHTML + "</xml>"
    let blob = new Blob([xmlDoc], {
        type: "xml"
    });
    saveAs(blob, "code.edb");
}
/*** 
 * TODO
 * Read what this function does
 * https://www.html5rocks.com/en/tutorials/file/dndfiles//
 *  
 ***/
let loadCode = () => {
    let blockss;
    let files = document.getElementById('files').files;
    if (!files.length) {
        alert('Please select a file!');
        return;
    }
    let file = files[0];
    let start = 0;
    let stop = file.size - 1;
    let reader = new FileReader();
    // If we use onloadend, we need to check the readyState.
    reader.onloadend = function (evt) {
        if (evt.target.readyState == FileReader.DONE) { // DONE == 2
            blockss = evt.target.result;
            let xml = Blockly.Xml.textToDom(blockss);
            Blockly.Xml.clearWorkspaceAndLoadFromXml(xml, workspace); // by default main block is displayed
        }
    };
    let blob = file.slice(start, stop + 1);
    reader.readAsBinaryString(blob);
}

let loadJSON = () => {
    fetch("../../sensorData.json")
        .then(response => response.json())
        .then(json => saveData(json));
}
let saveData = (data) => {
    rangeSensor = data.sensors.range;
    imu.accelerometer = data.sensors.imu.accelerometer;
    imu.gyroscope = data.sensors.imu.gyroscope;
    imu.magnetometer = data.sensors.imu.magnetometer;
    localStorage.setItem("Range", rangeSensor);
    localStorage.setItem("IMUa", imu.accelerometer);
    localStorage.setItem("IMUg", imu.gyroscope);
    localStorage.setItem("IMUm", imu.magnetometer);
    //console.log(`Range: ${rangeSensor} | Acceleromter: ${imu.accelerometer} | Gyroscope: ${imu.gyroscope} | Magnetometer: ${imu.magnetometer}`);
}