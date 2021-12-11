/********** MAIN **********/
Blockly.Blocks['input'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("main");
        this.appendStatementInput("commands")
            .setCheck("String");
        this.setColour("#00d080");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
/********** MOVEMENT **********/
Blockly.Blocks['forward'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Forward");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#07b7a6");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.Blocks['stop'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("stop");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#07b7a6");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.Blocks['backward'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("backward");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#07b7a6");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.Blocks['direction'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Direction")
            .appendField(new Blockly.FieldAngle(90), "angle");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#07b7a6");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.Blocks['speed'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Speed");
        this.appendValueInput("speed")
            .setCheck("Number");
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#07b7a6");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
/********** LOOPS **********/
Blockly.Blocks['repeat'] = {
    init: function() {
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
    init: function() {
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
    init: function() {
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
Blockly.Blocks['ifelse'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("if");
        this.appendValueInput("ifval1")
            .setCheck(null);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["==", "equal"],
                [">", "greater"],
                ["<", "less"]
            ]), "ifcond");
        this.appendValueInput("ifval2")
            .setCheck(null);
        this.appendStatementInput("if")
            .setCheck(null);
        this.appendDummyInput()
            .appendField("else");
        this.appendStatementInput("else")
            .setCheck(null);
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#edc620");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.Blocks['if'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("if");
        this.appendValueInput("ifval1")
            .setCheck(null);
        this.appendDummyInput()
            .appendField(new Blockly.FieldDropdown([
                ["==", "equal"],
                [">", "greater"],
                ["<", "less"]
            ]), "ifcond");
        this.appendValueInput("ifval2")
            .setCheck(null);
        this.appendStatementInput("if")
            .setCheck(null);
        this.setInputsInline(true);
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour("#edc620");
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
/********** MISC **********/
Blockly.Blocks['delay'] = {
    init: function() {
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