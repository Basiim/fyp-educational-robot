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
    var code = "\nif(" + value_circle_no + " == 1){\
                    \nvar x = document.querySelector('#test1');\
                    \nvar y = x.style.backgroundColor;\
                    \nlet z = rgbToHex(y);\
                    \nif(z == '" + colour_color + "')\
                        document.getElementById('res1').innerHTML = 'Circle1: correct!';\
                    \nelse\
                        document.getElementById('res1').innerHTML = 'Circle1: wrong!';\
}\
                \n" +
        "else if(" + value_circle_no + " == 2){\
            \nvar x = document.querySelector('#test2');\
            \nvar y = x.style.backgroundColor;\
            \nlet z = rgbToHex(y);\
            \nif(z == '" + colour_color + "')\
                document.getElementById('res2').innerHTML = 'Circle2: correct!';\
            \nelse\
                document.getElementById('res2').innerHTML = 'Circle2: wrong!';\
}\
                \n" +
        "else{\
            \nvar x = document.querySelector('#test2');\
            \nvar y = x.style.backgroundColor;\
            \nlet z = rgbToHex(y);\
            \nif(z == '" + colour_color + "')\
                document.getElementById('res2').innerHTML = 'Circle2: correct!';\
            \nelse\
                document.getElementById('res2').innerHTML = 'Circle2: wrong!';\
}\
                \n";
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
}