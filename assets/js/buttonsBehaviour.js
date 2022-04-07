saveIP = () => {
    ip = document.getElementById('ipAdd').value;
    document.getElementById('curIP').innerHTML = ip;
}
showCode = () => {
        Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
        let code = Blockly.JavaScript.workspaceToCode(workspace);
        console.log(code);
        let codeJSON = JSON.parse(code);
        let index = codeJSON.commands.indexOf("end");
        codeJSON.commands.splice(index, 1);
        document.getElementById('cmds').innerHTML = codeJSON.commands;
}
runCode = () => {
        Blockly.JavaScript.INFINITE_LOOP_TRAP = null;
        let code = Blockly.JavaScript.workspaceToCode(workspace);
        let codeJSON = JSON.parse(code);
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
                            url = url + codeJSON.commands[i];}
                        else if (codeJSON.commands[i].includes("/loop")) {
                            url = url + codeJSON.commands[i];
                        }else if (codeJSON.commands[i].includes("/endloop")) {
                            url = url + codeJSON.commands[i];
                        } else {
                            url = url + '/delay' + `-${codeJSON.commands[i]}` + "-";
                        }
                        sendReq(url);
                    }
            }
            /*setTimeout(function(){
                sendReq(url);
            },500);
            console.log(url);*/
            url = "http://" + ip;
        }
    }
    // TODO add response for fetch function
sendReq = (url) => {
        fetch(url, { method: 'GET', mode: 'no-cors' })
}
saveCode = () => {
        let xmlCode  = Blockly.Xml.workspaceToDom(workspace);
        let xmlDoc = '<xml>' + xmlCode.innerHTML + "</xml>"
        let blob = new Blob([xmlDoc], {
            type: "xml"
        });
        saveAs(blob, "code.edb");
    }
loadCode = () => {
        readBlob();
    }
    /*** 
     * TODO
     * Read what this function does
     * https://www.html5rocks.com/en/tutorials/file/dndfiles//
     *  
     ***/
readBlob = () => {
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
        reader.onloadend = function(evt) {
            if (evt.target.readyState == FileReader.DONE) { // DONE == 2
                blockss = evt.target.result; 
                let xml = Blockly.Xml.textToDom(blockss);
                Blockly.Xml.clearWorkspaceAndLoadFromXml(xml, workspace); // by default main block is displayed
            }
        };
        let blob = file.slice(start, stop + 1);
        reader.readAsBinaryString(blob);
    }