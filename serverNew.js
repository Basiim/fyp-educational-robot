const express = require('express');
const botController = require('./controllers/botController');
const path = require('path');
const Handlebars = require('handlebars');
const {engine} = require('express-handlebars');
const bodyparser = require('body-parser');
const { allowInsecurePrototypeAccess } = require('@handlebars/allow-prototype-access');
var Blockly = require('blockly');

var app = express();

app.use(bodyparser.urlencoded({
    extended: true
}));

app.use(bodyparser.json());
app.set('views', path.join(__dirname,'/views'));
app.engine('hbs', engine({ extname: 'hbs', defaultLayout: 'mainLayout', layoutsDir: __dirname + '/views/layouts', handlebars: allowInsecurePrototypeAccess(Handlebars) }));
app.set('view engine', 'hbs');
app.use("/style", express.static(__dirname+"/assets/css"));
app.use("/assets/css", express.static(__dirname + "/assets/css"));
app.use("/assets/js", express.static(__dirname + "/assets/js"));
app.use("/blocks", express.static(__dirname + "/blocks"));
app.use("/generators", express.static(__dirname + "/generators"));

// Server start
app.listen(process.env.PORT || 3000, () =>{
    console.log(`Server started on port 3000`);
})

app.use('/', botController);