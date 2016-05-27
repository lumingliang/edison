// class for servo ,some constancy actuator
//


module.exports = function(option) {
	var that;

	that = {
		port: option.port,
		instance: {} ,
		isOn:0 ,
		isStart: 0 ,
		monitorInterval: option.monitorInterval?option.monitorInterval:1000 ,
		isManualMode:0 ,
		manualRotationValue: 0 ,
		oldRotationVale:0,
		rotationValue:0 , //value is specifiy this servo's degree
		relySensor:option.relySensor, // only one rely sensor 
		maxRotation:option.maxRotation?option.maxRotation:160,


		computeRotationValue: function() {
			if(!that.isManualMode) {
				that.rotationValue = Math.round(eval('sensor'+that.relySensor).rawValue*that.maxRotation
);
			} else {
				that.rotationValue = that.manualRotationValue ;
			}
		} ,

		// set angle to the servo 
		set: function() {
			that.computeRotationValue();
			if(that.oldRotationVale != that.rotationValue) {
				that.instance.setAngle(that.rotationValue);
				that.oldRotationVale = that.rotationValue;
				console.log('set angle to'+that.rotationValue);
			}
		} ,

		start: function() {
			var servoModule = require("jsupm_servo");
			that.instance = new servoModule.ES08A(that.port);
			setInterval(that.set , that.monitorInterval);
			that.isStart = 1;
		}

	};

	return that;
}
