var raspi = require ('raspi');
var gpio = require('raspi-gpio');
const appRoot = require('app-root-path');

var express = require('express');
var router = express.Router();

var lastDate = 0;
var pin17 = 'GPIO17';
var button = null;

//init
raspi.init (() => {
        try {
            button = new gpio.DigitalOutput({
                    pin : pin17,
                    pullResistor: gpio.PULL_UP
                });
            button.write (gpio.HIGH);
        }
        catch (err) {
            console.log ("gpio err " + err);
        }
    });
    
function pushButton (val) {
    if (val) {
        button.write (gpio.LOW);
        setTimeout (pushButton, 500, false);
    }
    else {
        button.write (gpio.HIGH);
    }
}

function getDate() {
    console.log ('Get date ' + lastDate);
    return lastDate;
}

/* GET door command */
router.get('/button', function(req, res, next) {
  lastDate = Date.now();
  pushButton (true);
  res.send({status:'ok', msg:'Button pressed', date: lastDate});
});

/* GET door status */
router.get('/status', function(req, res, next) {
    var obj = {status:'ok', msg:'Door last opened', date: getDate()};
    res.send(obj);
});

module.exports = router;
