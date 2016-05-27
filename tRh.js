var driver = require('./sht20.js')(0)();

module.exports = function() {
	var that ; 
    
	that = {
		tempVal: 0,
		RhVal: 0,
		start: function() {
			setInterval(that.getTemp, 4000);
			setInterval(that.getRh, 5000);
		} ,

		getTemp: function() {
			that.tempVal = driver.getTemperatrue();
		} , 

		getRh: function() {
			that.RhVal = driver.getRh();
		}
	};

	return that;

}
