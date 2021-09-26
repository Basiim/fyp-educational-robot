Blockly.Blocks['delay'] = {
    init: function() {
        this.appendValueInput("delay")
            .setCheck("Number")
            .appendField("delay");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(230);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.Blocks['forward'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Forward");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(60);
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
        this.setColour(60);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
Blockly.Blocks['input'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("main");
        this.appendStatementInput("commands")
            .setCheck("String");
        this.setColour(60);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};