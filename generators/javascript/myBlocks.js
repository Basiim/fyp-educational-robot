/********** MAIN **********/
Blockly.JavaScript['input'] = function(block) {
    var statements_commands = Blockly.JavaScript.statementToCode(block, 'commands');
    var code = '{\n"commands":[' + statements_commands + '"!"]' + '\n' + "}";
    return code;
};
/********** MOVEMENT **********/
Blockly.JavaScript['forward'] = function(block) {
    return '"forward",';
};
Blockly.JavaScript['stop'] = function(block) {
    return '"stop",';
};
Blockly.JavaScript['backward'] = function(block) {
    return '"backward",';
};
Blockly.JavaScript['left'] = function(block) {
    return '"left",';
};
Blockly.JavaScript['right'] = function(block) {
    return '"right",';
};
Blockly.JavaScript['direction'] = function(block) {
    var angle_angle = block.getFieldValue('angle');
    var code = `"/angle-${angle_angle}-",`;
    return code;
};
Blockly.JavaScript['speed'] = function(block) {
    var value_speed = Blockly.JavaScript.valueToCode(block, 'speed', Blockly.JavaScript.ORDER_ATOMIC);
    if(value_speed > 100)
    {
        alert('Please Enter speed between 0 to 100');
        return'';
    }
    var code = `"/speed-${value_speed}-",`;
    return code;
};
/********** LOOPS **********/
Blockly.JavaScript['repeat'] = function(block) {
    var value_repeat = Blockly.JavaScript.valueToCode(block, 'repeat', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
    var statements_loop = statements_name;
    for (var i = 1; i < value_repeat; i++) {
        statements_loop = statements_loop + statements_name;
    }
    if (value_repeat == 0) {
        alert('kindly start from 1');
        return '';
    }
    var code = `${statements_loop}`;
    return code;
}
Blockly.JavaScript['for'] = function(block) {
    var value_for = Blockly.JavaScript.valueToCode(block, 'for', Blockly.JavaScript.ORDER_ATOMIC);
    var dropdown_condition = block.getFieldValue('condition');
    var value_condition = Blockly.JavaScript.valueToCode(block, 'condition', Blockly.JavaScript.ORDER_ATOMIC);
    var dropdown_increment = block.getFieldValue('increment');
    var statements_statements = Blockly.JavaScript.statementToCode(block, 'statements');
    var statements_loops = statements_statements;
    if (dropdown_condition == "less" && dropdown_increment == "plusplus") {
        for (var i = value_for; i < value_condition - 1; i++) {
            statements_loops = statements_loops + statements_statements;
        }
    }
    if (dropdown_condition == "greater" && dropdown_increment == "minusminus") {
        for (var i = value_for; i > value_condition + 1 ; i--) {
            statements_loops = statements_loops + statements_statements;
        }
    }
    var code = `${statements_loops}`;
    return code;
};
Blockly.JavaScript['while'] = function(block) {
    var dropdown_name = block.getFieldValue('NAME');
    var value_number = Blockly.JavaScript.valueToCode(block, 'number', Blockly.JavaScript.ORDER_ATOMIC);
    var code = '...;\n';
    return code;
};
/********** MISC **********/
Blockly.JavaScript['delay'] = function(block) {
    var value_name = Blockly.JavaScript.valueToCode(block, 'delay', Blockly.JavaScript.ORDER_ATOMIC);
    var time = block.getFieldValue('delay');
    var code = `"${value_name}",`;
    return code;
};