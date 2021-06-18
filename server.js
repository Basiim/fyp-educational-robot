const express = require('express');

const app = express();
const port = process.env.PORT || 5000;

app.use("/assets/css", express.static(__dirname + "/assets/css"));
app.use("/assets/js", express.static(__dirname + "/assets/js"));
app.use("/appengine", express.static(__dirname + "/appengine"));
app.use("/blocks", express.static(__dirname + "/blocks"));
app.use("/closure", express.static(__dirname + "/closure"));
app.use("/core", express.static(__dirname + "/core"));
app.use("/externs", express.static(__dirname + "/externs"));
app.use("/generators", express.static(__dirname + "/generators"));
app.use("/media", express.static(__dirname + "/media"));
app.use("/msg", express.static(__dirname + "/msg"));
app.use("/scripts", express.static(__dirname + "/scripts"));
app.use("/typings", express.static(__dirname + "/typings"));
app.use("/", express.static(__dirname + "/"));

app.get("/", function(req, res) {
    console.log("Index Loaded");
    res.sendFile(__dirname + "/index.html");
});
app.listen(port, function() {
    console.log("Server is Live");
})