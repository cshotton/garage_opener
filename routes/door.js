var gpio = require('onoff').Gpio;
const appRoot = require('app-root-path');

var express = require('express');
var router = express.Router();

var lastDate = 0;
var rpin = 22;
var opin = 17;
var cpin = 27;

var relay = null;
var oswitch = null;
var cswitch = null;

var cstate = 0;
var ostate = 0;

//init
relay = new gpio(rpin,'high');

function makeCallback (pin) {
    return function (err, value) {
        var thePin = pin;
        var tstate = 99;
        
        switch (thePin) {
            case opin:
                if (value != ostate) {
                    ostate = value;
                    tstate = ostate;
                }
                break;
                
            case cpin:
                if (value != cstate) {
                    cstate = value;
                    tstate = cstate;
                }
                break;
        }
        
        if (tstate != 99)
            console.log ('Pin ' + thePin + ': ' + tstate);
        if (err) {
            console.log (err);
        }
    };
}

oswitch = new gpio (opin, 'in', 'both');
cswitch = new gpio (cpin, 'in', 'both');
oswitch.watch (makeCallback (opin));
cswitch.watch (makeCallback (cpin));

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

function exitHandler (options, err) {
    console.log ('(Ctrl-C) terminating.');
    gpio.unwatchAll();
    process.exit();
}

process.on( 'SIGINT', exitHandler.bind (null, {exit:true}));


module.exports = router;
