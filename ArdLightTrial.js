//http://node-ardx.org/

var arduinojs = require("johnny-five");
boolean isGreen;

arduinojs.Board().on("ready", fucntion() {
	var myLight = new arduinojs.Led.RGB([ 9, 10, 11]);
	//RGB depends on waht pin you connect to on the right of the board 
	if (isGreen) {
		myLight.color("#0000ff")
	} else {
		myLight.color("#ff0000");
		//"ff0000 = red 
	}
	//myLight.off();
	//"ff0000 = red 
	//00ff00 blue
	//0000ff green 
	this.repl.inject({
    r: myLed
  	});
});
