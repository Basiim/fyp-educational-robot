Blockly.JavaScript['forward'] = function(block) {
    var value_direction = Blockly.JavaScript.valueToCode(block, 'direction', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = '"forward",';
    return code;
};
Blockly.JavaScript['backward'] = function(block) {
    var value_direction = Blockly.JavaScript.valueToCode(block, 'direction', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = '"backward",';
    return code;
};
Blockly.JavaScript['delay'] = function(block) {
    var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
    var time = block.getFieldValue('delay');
    // TODO: Assemble JavaScript into code variable.
    var code = `"${time}",`;
    return code;
};
Blockly.JavaScript['input'] = function(block) {
    var statements_commands = Blockly.JavaScript.statementToCode(block, 'commands');
    // TODO: Assemble JavaScript into code variable.
    var code = '{\n"commands":[' + statements_commands + '"end"]' + '\n' + "}";
    return code;
};