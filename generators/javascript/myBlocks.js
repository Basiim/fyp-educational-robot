Blockly.JavaScript['color_select'] = function(block) {
    var colour_color = block.getFieldValue('color');
    var value_color_input = Blockly.JavaScript.valueToCode(block, 'color_input', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = "document.getElementById('test').style.backgroundColor = " + colour_color + "\n";
    return code;
};
Blockly.JavaScript['mini_game'] = function(block) {
    //var value_circle_no = Blockly.JavaScript.valueToCode(block, 'circle_no', Blockly.JavaScript.ORDER_ATOMIC);
    var value_circle_no = block.getFieldValue('circle_no');
    var colour_color = block.getFieldValue('color');
    var value_circle_color = Blockly.JavaScript.valueToCode(block, 'circle_color', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = "hello";
    return code;
};

function rgbToHex(col) {
    if (col.charAt(0) == 'r') {
        col = col.replace('rgb(', '').replace(')', '').split(',');
        var r = parseInt(col[0], 10).toString(16);
        var g = parseInt(col[1], 10).toString(16);
        var b = parseInt(col[2], 10).toString(16);
        r = r.length == 1 ? '0' + r : r;
        g = g.length == 1 ? '0' + g : g;
        b = b.length == 1 ? '0' + b : b;
        var colHex = '#' + r + g + b;
        return colHex;
    }
};
Blockly.JavaScript['forward'] = function(block) {
    var value_direction = Blockly.JavaScript.valueToCode(block, 'direction', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = 'forward';
    return code;
};
Blockly.JavaScript['backward'] = function(block) {
    var value_direction = Blockly.JavaScript.valueToCode(block, 'direction', Blockly.JavaScript.ORDER_ATOMIC);
    // TODO: Assemble JavaScript into code variable.
    var code = 'backward';
    return code;
};