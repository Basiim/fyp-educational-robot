import Blockly from 'blockly';

Blockly.inject('blocklyDiv', {
    toolbox: document.getElementById('toolbox'),
    move: {
        scrollbars: {
            vertical: true,
            horizontal: false
        }
    },
    trashcan: true,
    renderer: 'zelos'
});
Blockly.Events.disable();
Blockly.Xml.domToWorkspace(document.getElementById('main'), workspace);