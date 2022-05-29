const express = require('express');
var router = express.Router();
var Blockly = require('blockly');


router.get('/',(req,res)=>{
    res.render('botMain/mainView', { viewTitle: 'Educational Bot' });
    var xmlText = '<xml xmlns="http://www.w3.org/1999/xhtml">' +
    '<block type="variables_set">' +
    '<field name="VAR">blockly</field>' +
    '<value name="VALUE">' +
    '<block type="text">' +
    '<field name="TEXT">Hello world!</field>' +
    '</block>' +
    '</value>' +
    '</block>' +
    '</xml>';

    try {
        var xml = Blockly.Xml.textToDom(xmlText);
    }
    catch (e) {
        console.log(e);
        return ''
    }

    var workspace = new Blockly.Workspace();
    Blockly.Events.disable();
    Blockly.Xml.domToWorkspace(xml, workspace);
    Blockly.inject('blocklyDiv', {
        move: {
            scrollbars: {
                vertical: true,
                horizontal: false
            }
        },
        trashcan: true,
        renderer: 'zelos'
    });
})

module.exports = router;