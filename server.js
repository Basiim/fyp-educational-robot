const { COLOUR_BLEND_COLOUR1 } = require('blockly/msg/en');
const express = require('express');
const ip = require('ip');
const app = express();
const port = process.env.PORT || 3000;

app.use("/", express.static(__dirname + "/"));
app.use("/assets/css", express.static(__dirname + "/assets/css"));
app.use("/assets/js", express.static(__dirname + "/assets/js"));
app.use("/blocks", express.static(__dirname + "/blocks"));
app.use("/generators", express.static(__dirname + "/generators"));

app.get("/", function(req, res) {
    console.log("Index Loaded");
    res.sendFile(__dirname + "/index.html");
});
app.get("/ack",function(req,res){
    console.log("Ack recieved");
})
app.listen(port, function() {
    console.log("Server is Live");
    console.log(ip.address());
})