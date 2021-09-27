var ip;

function saveIP() {
    ip = document.getElementById('ipAdd').value;
    document.getElementById('curIP').innerHTML = ip;
}

function showCode() {
    // Generate JavaScript code and display it.
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    var codeJSON = JSON.parse(code);
    var index = codeJSON.commands.indexOf("end");
    codeJSON.commands.splice(index, 1);
    document.getElementById('cmds').innerHTML = codeJSON.commands;
}

function runCode() {
    // Generate JavaScript code and run it.
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    var codeJSON = JSON.parse(code);
    let len = codeJSON.commands.length;
    console.log(ip);
    var url = "http://" + ip;
    /***** TODO: add request *****/
    for (var i = 0; i < len - 1; i++) {
        switch (codeJSON.commands[i]) {
            case "forward":
                url = url + "/23/off";
                sendReq(url);
                break;
            case "backward":
                url = url + "/23/on";
                sendReq(url);
                break;
            default:
                console.log("Error");
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