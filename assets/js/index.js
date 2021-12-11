var ip = "0.0.0.0";

function saveIP() {
    ip = document.getElementById('ipAdd').value;
    document.getElementById('curIP').innerHTML = ip;
}

function showCode() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    var codeJSON = JSON.parse(code);
    var index = codeJSON.commands.indexOf("end");
    codeJSON.commands.splice(index, 1);
    console.log(codeJSON.commands);
    let arrayLength = codeJSON.commands.length;
    /*for (var i = 0; i < arrayLength; i++) {
        var node = document.createElement("P");
        var textnode = document.createTextNode(codeJSON.commands[i]);
        node.appendChild(textnode);
        document.getElementById("cmds").appendChild(node);
    }*/
    document.getElementById('cmds').innerHTML = codeJSON.commands;
}

function runCode() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    var codeJSON = JSON.parse(code);
    let len = codeJSON.commands.length;
    var url = "http://" + ip;
    for (var i = 0; i < len; i++) {
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
                    } else {
                        url = url + '/delay' + `-${codeJSON.commands[i]}` + "-";
                    }
                    sendReq(url);
                }
        }
        url = "http://" + ip;
    }
}

function sendReq(url) {
    fetch(url, { mode: 'no-cors' })
        .then(data => {
            return data.json()
        })
        .then(res => {
            console.log(res)
        })
}