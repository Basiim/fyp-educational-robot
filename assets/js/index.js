function showCode() {
    // Generate JavaScript code and display it.
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    var codeJSON = JSON.parse(code);
    alert(codeJSON.commands);
    let len = codeJSON.commands.length;
    for (var i = 0; i < len - 1; i++) {
        switch (codeJSON.commands[i]) {
            case "forward":
                console.log("forward true");
                break;
            case "backward":
                console.log("backward true");
                break;
            default:
                console.log("Error");
        }
    }
}

function runCode() {
    // Generate JavaScript code and run it.
    Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    var codeJSON = JSON.parse(code);
    let len = codeJSON.commands.length;
    var url;
    /***** TODO: add request *****/
    for (var i = 0; i < len - 1; i++) {
        switch (codeJSON.commands[i]) {
            case "forward":
                url = "http://192.168.1.3/23/off"
                sendReq(url);
                break;
            case "backward":
                url = "http://192.168.1.3/23/on"
                sendReq(url);
                break;
            default:
                console.log("Error");
        }
    }
}

function sendReq(url) {
    fetch(url)
        .then(data => {
            return data.json()
        })
        .then(res => {
            console.log(res)
        })
}