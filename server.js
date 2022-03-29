const express = require('express');
const bodyParser = require('body-parser');
const ip = require('ip');
const open = require('open');
const path = require("path");
const app = express();
const port = process.env.PORT || 3000;
let status;

app.use(bodyParser.urlencoded({extend:true}));
app.use("/", express.static(__dirname + "/"));
app.use("/assets/css", express.static(__dirname + "/assets/css"));
app.use("/assets/js", express.static(__dirname + "/assets/js"));
app.use("/blocks", express.static(__dirname + "/blocks"));
app.use("/generators", express.static(__dirname + "/generators"));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
const dirPath = path.join(__dirname, '\\views');
app.set('views', dirPath);
app.get("/", function(req, res) {
    console.log("Index Loaded");
    //res.sendFile(__dirname + "/index.ejs");
    res.render('index.ejs',{title:"Educational Bot", state:"Free", mainCode:"Main Test", loopCode:"loop Test"});
});
app.get("/ack", function(req,res){
    //res.render(__dirname + "/index.ejs",{title:"Educational Bot", state:"Busy"});
    //console.log('Ack recived');
    status = 'busy';
    res.destroy();
})

app.get("/free", function(req,res){
    //res.render(__dirname + "/index.ejs",{title:"Educational Bot", state:"Free"});
    status = 'free';
    res.destroy();
})
app.listen(port, function() {
    console.log("Server is Live");
    console.log(ip.address());
    // TODO study pkg documentation and make .exe work
    //open('http://localhost:3000');
})