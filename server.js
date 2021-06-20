const express = require('express');

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
app.listen(port, function() {
    console.log("Server is Live");
})