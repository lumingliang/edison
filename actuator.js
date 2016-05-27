// 
//
// a class for sensors



module.exports = function(option) {
	var that;

	that = {
		port: option.port ,
		/*
		 * relySensor is a array [ [sensor:n,checkStatu],[sensors:n,checkStatu] ]
		 * a beter construct , [sensor:n, sensor:2]
		 */
		relySensor: option.relySensor, //  [  ]  the sensors rely on
		instance: {},
		isOn:0, // if the actuator is on	
		isStart:0,
		monitorInterval:option.monitorInterval?option.monitorInterval:2000,
		threshold: option.threshold?option.threshold:[0,1] ,
		totalStatu: 0 ,
		isManualMode: 0,
		manualModeAction: 0,

		// flowing are the action this actuator make exeue

		computeTotalStatu: function() {
			that.totalStatu = 0 ;
			for(var i=0; i<that.relySensor.length; i++) {
				that.totalStatu+=eval('sensor'+that.relySensor[i]).statu; //动态变量名

				// console.log('statu in actuator'+i+eval('sensor'+that.relySensor[i]).statu);
			 }
			
				// console.log('total statu'+that.totalStatu);
		} ,

		monitor: function() {
			if(!that.isManualMode) {
				that.computeTotalStatu();

				if(that.totalStatu < that.threshold[1]&&that.totalStatu>=that.threshold[0] ) {
					if(that.isOn == 0) {
						that.instance.write(1);
						that.isOn = 1;
						console.log('write 1 to actuator'+that.port);
					}
				} else {
					//only when actuator isOn ,write 0 to it
					if(that.isOn == 1) {
						that.instance.write(0);
						that.isOn = 0;
					}// when if off ,we do nothing to it
				} 

			} else {
				if(that.manualModeAction) {
					that.instance.write(1);
				} else that.instance.write(0);
			}
		} ,

		start: function() {
			that.instance = new mraa.Gpio(that.port);
			that.instance.dir(mraa.DIR_OUT);
			setInterval(that.monitor , that.monitorInterval);
			that.isStart = 1;
		}

	};

	return that;
}
