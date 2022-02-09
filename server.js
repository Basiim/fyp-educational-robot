const express = require('express');
var bodyParser = require('body-parser');
const ip = require('ip');
const app = express();
const port = process.env.PORT || 3000;
var status;

app.use(bodyParser.urlencoded({extend:true}));
app.use("/", express.static(__dirname + "/"));
app.use("/assets/css", express.static(__dirname + "/assets/css"));
app.use("/assets/js", express.static(__dirname + "/assets/js"));
app.use("/blocks", express.static(__dirname + "/blocks"));
app.use("/generators", express.static(__dirname + "/generators"));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname);

app.get("/", function(req, res) {
    console.log("Index Loaded");
    res.render(__dirname + "/index.ejs",{title:"Educational Bot", state:"Free"});
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
})