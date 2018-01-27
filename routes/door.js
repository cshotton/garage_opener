var gpio = require('onoff').Gpio;
const appRoot = require('app-root-path');

var express = require('express');
var router = express.Router();

var lastDate = 0;
var pin = 22;
var relay = null;

//init
relay = new gpio(pin,'high');
    
function pushButton (val) {
    if (val) {
        relay.writeSync (0);
        setTimeout (pushButton, 500, false);
    }
    else {
        relay.writeSync (1);
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
