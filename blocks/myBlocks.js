Blockly.Blocks['color_select'] = {
    init: function() {
        this.appendValueInput("color_input")
            .setCheck(null)
            .appendField("Set Background color")
            .appendField(new Blockly.FieldColour("#ff0000"), "color");
        this.setPreviousStatement(true, null);
        this.setNextStatement(true, null);
        this.setColour(105);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};
/*Blockly.Blocks['mini_game'] = {
    init: function() {
        this.appendValueInput("circle_no")
            .setCheck("Number")
            .appendField("Circle Number");
        this.appendDummyInput()
            .appendField("Color")
            .appendField(new Blockly.FieldColour("#ff0000"), "color");
        this.setInputsInline(true);
        this.setColour(240);
        this.setTooltip("");
        this.setHelpUrl("");
    }
};*/
Blockly.Blocks['mini_game'] = {
    init: function() {
        this.appendDummyInput()
            .appendField("Circle Number")
            .appendField(new Blockly.FieldDropdown([
                ["1", "1"],
                ["2", "2"],
                ["3", "3"]
            ]), "circle_no");
        this.appendDummyInput()
            .appendField("Color")
            .appendField(new Blockly.FieldColour("#ff0000"), "color");
        this.setInputsInline(true);
        this.setColour(240);
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