Blockly.JavaScript['forward'] = function(block) {
    var value_direction = Blockly.JavaScript.valueToCode(block, 'direction', Blockly.JavaScript.ORDER_ATOMIC);
    var code = '"forward",';
    return code;
};
Blockly.JavaScript['stop'] = function(block) {
    var value_direction = Blockly.JavaScript.valueToCode(block, 'direction', Blockly.JavaScript.ORDER_ATOMIC);
    var code = '"stop",';
    return code;
};
Blockly.JavaScript['backward'] = function(block) {
    var value_direction = Blockly.JavaScript.valueToCode(block, 'direction', Blockly.JavaScript.ORDER_ATOMIC);
    var code = '"backward",';
    return code;
};
Blockly.JavaScript['left'] = function(block) {
    var value_direction = Blockly.JavaScript.valueToCode(block, 'direction', Blockly.JavaScript.ORDER_ATOMIC);
    var code = '"left",';
    return code;
};
Blockly.JavaScript['right'] = function(block) {
    var value_direction = Blockly.JavaScript.valueToCode(block, 'direction', Blockly.JavaScript.ORDER_ATOMIC);
    var code = '"right",';
    return code;
};
Blockly.JavaScript['delay'] = function(block) {
    var value_name = Blockly.JavaScript.valueToCode(block, 'delay', Blockly.JavaScript.ORDER_ATOMIC);
    var time = block.getFieldValue('delay');
    var code = `"${value_name}",`;
    return code;
};
Blockly.JavaScript['input'] = function(block) {
    var statements_commands = Blockly.JavaScript.statementToCode(block, 'commands');
    var code = '{\n"commands":[' + statements_commands + '"!"]' + '\n' + "}";
    return code;
};