const express = require('express');
const bodyParser = require('body-parser');
const ip = require('ip');
const open = require('open');
const path = require("path");
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;
/*let obj = {
    "sensors": {
        "range": "0",
        "imu": {
            "accelerometer": "0",
            "gyroscope": "0",
            "magnetometer": "0"
        }
    }
}*/
let obj;
app.use(bodyParser.urlencoded({ extend: true }));
app.use("/home", express.static(__dirname + "/landingPage"));
app.use("/landingPage/dist/css", express.static(__dirname + "/landingPage/dist/css"));
app.use("/landingPage/dist/js", express.static(__dirname + "/landingPage/dist/js"));
app.use("/landingPage/dist/images", express.static(__dirname + "/landingPage/dist/images"));
app.use("/landingPage/src/scss", express.static(__dirname + "/landingPage/src/scss"));
app.use("/landingPage/src/js", express.static(__dirname + "/landingPage/src/js"));
app.use("/landingPage/src/images", express.static(__dirname + "/landingPage/src/images"));

app.use("/", express.static(__dirname + "/"));
app.use("/assets/css", express.static(__dirname + "/assets/css"));
app.use("/assets/js", express.static(__dirname + "/assets/js"));
app.use("/assets/img", express.static(__dirname + "/assets/img"));
app.use("/blocks", express.static(__dirname + "/blocks"));
app.use("/generators", express.static(__dirname + "/generators"));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
const dirPath = path.join(__dirname, '/views');
app.set('views', dirPath);

/********** PAGES **********/
app.get("/", function (req, res) {
    res.redirect("/home")
})
app.get("/home", function (req, res) {
    res.sendFile(__dirname + '/landingPage/index.html');
});
app.get("/app", function (req, res) {
    res.render('index.ejs', { title: "Blockly Bot", state: "Free", mainCode: "Main Test", loopCode: "loop Test" });
});

/********** SENSOR DATA **********/
app.get("/sensors/range/:data", function (req, res) {
    fs.readFile('sensorData.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return
        }
        try {
            obj = JSON.parse(data);
        } catch (err) {
            console.log('Error catched:', err);
        }
        //console.log(obj);
    })
    obj.sensors.range = req.params.data;
    console.log(obj);
    var json = JSON.stringify(obj);
    fs.writeFile('sensorData.json', json, 'utf8', () => {
        //res.json(obj);
        res.status(200);
        res.destroy();
    });
    res.json(obj);
    //res.status(200);
    //res.destroy();
})
app.get("/sensors/imu/accelerometer/:data", function (req, res) {
    fs.readFile('sensorData.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return
        }
        obj = JSON.parse(data);
        //console.log(obj);
    })
    obj.sensors.imu.accelerometer = req.params.data;
    var json = JSON.stringify(obj);
    fs.writeFile('sensorData.json', json, 'utf8', () => {
        res.json(obj);
    });
    res.json(obj);
})
app.get("/sensors/imu/gyroscope/:data", function (req, res) {
    fs.readFile('sensorData.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return
        }
        obj = JSON.parse(data);
        //console.log(obj);
    })
    obj.sensors.imu.gyroscope = req.params.data;
    var json = JSON.stringify(obj);
    fs.writeFile('sensorData.json', json, 'utf8', () => {
        res.json(obj);
    });
    res.json(obj);
})
app.get("/sensors/imu/magnetometer/:data", function (req, res) {
    fs.readFile('sensorData.json', 'utf8', (err, data) => {
        if (err) {
            console.log(err);
            return
        }
        obj = JSON.parse(data);
        //console.log(obj);
    })
    obj.sensors.imu.magnetometer = req.params.data;
    var json = JSON.stringify(obj);
    fs.writeFile('sensorData.json', json, 'utf8', () => {
        res.json(obj);
    });
    res.json(obj);
})

/********** STATE **********/
app.get("/ack", function (req, res) {
    //console.log('Ack recived');
    status = 'busy';
    res.destroy();
})
app.get("/free", function (req, res) {
    status = 'free';
    res.destroy();
})

app.listen(port, function () {
    console.log("Server is Live");
    console.log(ip.address());
    // TODO study pkg documentation and make .exe work
    //open('http://localhost:3000');
})

async function readFile() {

}

// Prism js