var ip;

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
    document.getElementById('cmds').innerHTML = codeJSON.commands;
}

function runCode() {
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    var codeJSON = JSON.parse(code);
    let len = codeJSON.commands.length;
    console.log(ip);
    var url = "http://" + ip;
    for (var i = 0; i < len - 1; i++) {
        switch (codeJSON.commands[i]) {
            case "forward":
                url = url + "/forward";
                sendReq(url);
                break;
            case "backward":
                url = url + "/backward";
                sendReq(url);
                break;
            case "left":
                url = url + "/left";
                sendReq(url);
                break;
            case "right":
                url = url + "/right";
                sendReq(url);
                break;
            case "stop":
                url = url + "/stop";
                sendReq(url);
                break;
            default: // Delay to fix later
                {
                    url = url + `/${codeJSON.commands[i]}`;
                    sendReq(url);
                }
        }
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