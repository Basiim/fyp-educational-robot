/*************************************************************************************
 * 
 * 
 * Title: Generator
 * 
 * Version: 0.2
 * 
 * Path: /assets/js/generator.js
 * 
 * Authors: Basim Abdullah Tariq
 *          Muhammad Talha Sajjad
 * 
 * Description: This file contains the backend generator code of all the custom blocks 
 *              that are included in the app. The generator code was edited as per the
 *              requirement of the embedded software of our robot.
 * 
 * Refrence(s): 
 * 
 * 
 *************************************************************************************/
let condIterator = 0;
/********** MAIN **********/
Blockly.JavaScript['input'] = function (block) {
    var statements_commands = Blockly.JavaScript.statementToCode(block, 'commands');
    var code = '{\n"commands":[' + statements_commands + '"!"]' + '\n' + "}";
    return code;
};
/********** MOVEMENT **********/
Blockly.JavaScript['forward'] = function (block) {
    return '"forward",';
};
Blockly.JavaScript['stop'] = function (block) {
    return '"stop",';
};
Blockly.JavaScript['backward'] = function (block) {
    return '"backward",';
};
Blockly.JavaScript['direction'] = function (block) {
    var angle_angle = block.getFieldValue('angle');
    if (angle_angle >= 0 && angle_angle < 10)
        angle_angle = "00" + angle_angle;
    else if (angle_angle >= 10 && angle_angle < 100)
        angle_angle = "0" + angle_angle;
    else
        angle_angle = angle_angle;
    var code = `"/angle-${angle_angle}-",`;
    return code;
};
Blockly.JavaScript['speed'] = function (block) {
    var value_speed = Blockly.JavaScript.valueToCode(block, 'speed', Blockly.JavaScript.ORDER_ATOMIC);
    if (value_speed > 100) {
        alert('Please Enter speed between 0 to 100');
        return '';
    } else if (value_speed == 100) {
        value_speed = value_speed;
    }
    else if (value_speed < 100 && value_speed > 9) {
        value_speed = "0" + value_speed;
    } else {
        value_speed = "00" + value_speed;
    }
    var code = `"/speed-${value_speed}-",`;
    return code;
};
/********** LOOPS **********/
Blockly.JavaScript['repeat'] = function (block) {
    var value_repeat = Blockly.JavaScript.valueToCode(block, 'repeat', Blockly.JavaScript.ORDER_ATOMIC);
    var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
    if (value_repeat == 0) {
        alert('kindly start from 1');
        return '';
    }
    let code = ``;
    for (let i = 0; i < value_repeat; i++) {
        code += statements_name;
    }
    //return code;
    return `"/loop-${value_repeat}-",` + `${statements_name}` + `"/endloop",`;
}
Blockly.JavaScript['for'] = function (block) {
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
        for (var i = value_for; i > value_condition + 1; i--) {
            statements_loops = statements_loops + statements_statements;
        }
    }
    var code = `${statements_loops}`;
    return code;
};
Blockly.JavaScript['while'] = function (block) {
    var dropdown_name = block.getFieldValue('NAME');
    var value_number = Blockly.JavaScript.valueToCode(block, 'number', Blockly.JavaScript.ORDER_ATOMIC);
    var code = '...;\n';
    return code;
};
/******* CONDITIONS *******/
Blockly.JavaScript['controls_if'] = block => {
    let n = 0;
    let code = '';
    let finalif = '';
    let finalelse = '';
    let cond = false;
    do {
        const conditionCode = Blockly.JavaScript.valueToCode(block, 'IF' + n, Blockly.JavaScript.ORDER_NONE) || 'false';
        console.log(eval(conditionCode));
        let branchCode = Blockly.JavaScript.statementToCode(block, 'DO' + n);
        if (Blockly.JavaScript.STATEMENT_SUFFIX) {
            branchCode = Blockly.JavaScript.prefixLines(
                Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_SUFFIX, block),
                Blockly.JavaScript.INDENT) +
                branchCode;
        }
        code += (n > 0 ? ' else ' : '') + 'if (' + conditionCode + ') {\n' +
            branchCode + '}';

        localStorage.setItem(`Conditional-${condIterator}`, code);
        // Solve conditionals
        if (eval(conditionCode)) { // Is true
            finalif = branchCode;
            cond = true;
        }
        n++;
    } while (block.getInput('IF' + n));

    if (block.getInput('ELSE') || Blockly.JavaScript.STATEMENT_SUFFIX) {
        let branchCode = Blockly.JavaScript.statementToCode(block, 'ELSE');
        if (Blockly.JavaScript.STATEMENT_SUFFIX) {
            branchCode = Blockly.JavaScript.prefixLines(
                Blockly.JavaScript.injectId(Blockly.JavaScript.STATEMENT_SUFFIX, block),
                Blockly.JavaScript.INDENT) +
                branchCode;
        }
        code += ' else {\n' + branchCode + '}';
        localStorage.setItem(`Conditional-${condIterator}`, code);
        finalelse = branchCode;
    }
    /*if (localStorage.getItem(`Conditional-${condIterator}`).exists())
        condIterator = condIterator;
    else
        condIterator++;*/
    return (cond == true ? finalif : finalelse);
}
/********** FUNCTIONS **********/
Blockly.JavaScript['procedures_defnoreturn'] = function (block) {
    var functionName = block.getFieldValue('NAME');
    var functionStatements = Blockly.JavaScript.statementToCode(block, 'STACK');

    localStorage.setItem(`${functionName}`, functionName);
    localStorage.setItem(`${functionName}-args`, block.arguments_);
    localStorage.setItem(`${functionName}-code`, functionStatements);
    return null;
};
Blockly.JavaScript['procedures_callnoreturn'] = function (block) {
    var functionName = block.getFieldValue('NAME');
    var code = '';

    if (localStorage.getItem(`${functionName}-args`) != '')
        console.log('Arguments:' + localStorage.getItem(`${functionName}-args`) != '');
    if (localStorage.getItem(`${functionName}-code`) != '')
        code = localStorage.getItem(`${functionName}-code`);
    //var code = `"func-${localStorage.functionNameNR}",` + localStorage.functionCodeNR;
    return code;
};
Blockly.JavaScript['procedures_defreturn'] = function (block) {
    var functionName = block.getFieldValue('NAME');
    var functionStatements = Blockly.JavaScript.statementToCode(block, 'STACK');
    var functionReturn = Blockly.JavaScript.valueToCode(block, 'RETURN');

    console.log(functionReturn);

    localStorage.setItem(`${functionName}`, functionName);
    localStorage.setItem(`${functionName}-args`, block.arguments_);
    localStorage.setItem(`${functionName}-code`, functionStatements);
    return null;
};
Blockly.JavaScript['procedures_callreturn'] = function (block) {
    var code = localStorage.functionCodeR;
    return code;
};
/********** MISC **********/
Blockly.JavaScript['delay'] = function (block) {
    var value_name = Blockly.JavaScript.valueToCode(block, 'delay', Blockly.JavaScript.ORDER_ATOMIC);
    var time = block.getFieldValue('delay');
    if (value_name >= 0 && value_name < 10)
        value_name = "00" + value_name;
    else if (value_name >= 10 && value_name < 100)
        value_name = "0" + value_name;
    else
        value_name = value_name;
    var code = `"/delay-${value_name}-",`;
    return code;
};

Blockly.JavaScript['variables_get'] = function (block) {
    // Variable getter.
    const code = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('VAR'), 'VARIABLE');
    let value;
    if (code == "Range2")
        value = localStorage.getItem(`Range`);
    else if (code == "Accelerometer")
        value = localStorage.getItem(`IMUa`);
    else if (code == "Gyroscope")
        value = localStorage.getItem(`IMUg`);
    else if (code == "Magnetometer")
        value = localStorage.getItem(`IMUm`);
    else
        value = localStorage.getItem(`${code}`);
    console.log(value);
    console.log(code);
    return [value, Blockly.JavaScript.ORDER_ATOMIC];
};

Blockly.JavaScript['variables_set'] = function (block) {
    // Variable setter.
    const argument0 = Blockly.JavaScript.valueToCode(
        block, 'VALUE', Blockly.JavaScript.ORDER_ASSIGNMENT) || '0';
    const varName = Blockly.JavaScript.nameDB_.getName(block.getFieldValue('VAR'), 'VARIABLE');
    localStorage.setItem(`${varName}`, argument0);
    return `"/var-${varName}-${argument0}",`;
};
Blockly.JavaScript['variables_get_dynamic'] = Blockly.JavaScript['variables_get'];
Blockly.JavaScript['variables_set_dynamic'] = Blockly.JavaScript['variables_set'];