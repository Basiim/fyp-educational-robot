/*************************************************************************************
 * 
 * 
 * Title: Blocks
 * 
 * Version: 0.2
 * 
 * Path: /assets/js/blocks.js
 * 
 * Authors: Basim Abdullah Tariq
 *          Muhammad Talha Sajjad
 * 
 * Description: This file contains the block definition of all the custom blocks that 
 *              are included in the app. These block definitions were made with the
 *              help of blockly dev tools.
 * 
 * Refrence(s): https://blockly-demo.appspot.com/static/demos/blockfactory/index.html
 * 
 * 
 *************************************************************************************/

/********** MAIN **********/
Blockly.Blocks['input'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("main");
        this.appendStatementInput("commands")
            .setCheck("String");
        this.setColour("#00d080");
        this.setTooltip("> This is the main function which is executed by default");
        this.setHelpUrl("");
    }
};
/********** MOVEMENT **********/
Blockly.Blocks['forward'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Forward");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#07b7a6");
        this.setTooltip("> This block will move the robot forward with specified speed.\n" +
            "> The block will only run if speed block is initiated before.");
        this.setHelpUrl("");
    }
};
Blockly.Blocks['stop'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("stop");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#07b7a6");
        this.setTooltip("> This block will stop the robot if it was previously moving.\n");
        this.setHelpUrl("");
    }
};
Blockly.Blocks['backward'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("backward");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#07b7a6");
        this.setTooltip("> This block will move the robot backwards with specified speed.\n" +
            "> The block will only run if speed block is initiated before.");
        this.setHelpUrl("");
    }
};
Blockly.Blocks['direction'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Direction")
            .appendField(new Blockly.FieldAngle(90), "angle");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#07b7a6");
        this.setTooltip("> This block will move the robot at an angle provided with specified speed.\n" +
            "> The block will only run if speed block is initiated before.");
        this.setHelpUrl("");
    }
};
Blockly.Blocks['speed'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Speed");
        this.appendValueInput("speed")
            .setCheck("Number");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#07b7a6");
        this.setTooltip("> This block will set the speed of the robot. \n" +
            "> The range of speed is from 0-100.");
        this.setHelpUrl("");
    }
};
/********** LOOPS **********/
Blockly.Blocks['repeat'] = {
    init: function () {
        this.appendValueInput("repeat")
            .setCheck("Number")
            .appendField(new Blockly.FieldLabelSerializable("repeat"), "repeat");
        this.appendStatementInput("NAME")
            .setCheck(null);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#fc832e");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.Blocks['for'] = {
    init: function () {
        this.appendValueInput("for")
            .setCheck("Number")
            .setAlign(Blockly.ALIGN_CENTRE)
            .appendField(new Blockly.FieldLabelSerializable("for var i ="), "for");
        this.appendValueInput("condition")
            .setCheck(null)
            .appendField("i ")
            .appendField(new Blockly.FieldDropdown([
                [">", "greater"],
                ["<", "less"]
            ]), "condition");
        this.appendDummyInput()
            .appendField("i")
            .appendField(new Blockly.FieldDropdown([
                ["++", "plusplus"],
                ["--", "minusminus"]
            ]), "increment");
        this.appendStatementInput("statements")
            .setCheck(null);
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#fc832e");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.Blocks['while'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("while var")
            .appendField(new Blockly.FieldDropdown([
                ["==", "equal"],
                ["!=", "not equal"],
                [">=", "greater equal"],
                ["<=", "less equal"]
            ]), "NAME");
        this.appendValueInput("number")
            .setCheck("Number");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#fc832e");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
/******* CONDITIONS *******/

/********** VARS **********/
/*Blockly.Blocks['variables_get_panda'] = {
    init: function() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldVariable(
                "VAR_NAME", ['Panda'], 'Panda'), "FIELD_NAME");
        this.setOutput(true, 'Panda');
    }
};

// Block for variable setter.
Blockly.Blocks['variables_set_panda'] = {
    init: function() {
        this.appendValueInput("NAME")
            .setCheck('Panda')
            .appendField("set")
            .appendField(new Blockly.FieldVariable(
                "VAR_NAME", null, ['Panda'], 'Panda'), "FIELD_NAME")
            .appendField("to");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
    }
};*/
/********** MISC **********/
Blockly.Blocks['delay'] = {
    init: function () {
        this.appendValueInput("delay")
            .setCheck("Number")
            .appendField("delay");
        this.appendDummyInput()
            .appendField("seconds");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#fe96aa");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};

Blockly.Blocks['block_type'] = {
    init: function () {
        this.appendValueInput("NAME")
            .setCheck(null)
            .appendField("Blockly");
        this.setInputsInline(false);
        this.setColour("#000");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.Blocks['bot'] = {
    init: function () {
        this.appendDummyInput()
            .appendField("Bot");
        this.setInputsInline(false);
        this.setOutput(true, null);
        this.setColour("#29fd53");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};