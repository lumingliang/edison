// simple driver for sht20 ,the temperatrue and humidity sensor

module.exports = function(option) {
	var that;

	that = {
		// definge some const value for the sensor

		address: 64, //1000,000 not need to put the w or read

		// some command to access the sensor
		triggerTempHold: 0xE3 ,// 1110,0011 the hold master mode to for trigger temperatrue measurement
		triggerRhHold: 0xE5 ,// 1110,0101 hold master mode, trigger humidity measurement
		triggerTempNHold: 0xF3, // temperatrue, no hole mode
		triggerRhNHold: 0xF5 ,//humidity ,no hold mode
		softResetCommand: 0xFE ,// 1111, 1110 , soft reset command
		// measurement time for at different resolutions
		TempMeasurementTime: 90, // 66 to 85 ms for 14 bit resolution of the temperatrueMaesutementTime
		RH_Measurement_time: 40, // 33 to 43 ms for 13bit resolution of the RH_Measurement_time
		soft_reset_time: 15, //less than 15 ms
		read_user_register_command: 0xE7,
		write_user_register_command: 0xE5,

		instance: {} , //i2c instance with bus 
		tempBit: new Buffer(3),
		tempVal: 0,
		RhBit: 0,
		RhVal: 0,
        tempEv: 100, // 温度的前一个修正值
        RhEv: 100, //湿度前一个纠正值

		start: function() {
			var m = require('mraa');
			that.instance = new m.I2c(option.bus);
			return that;
		} ,

		getTemperatrue: function() {
			that.cache = 0;
			that.instance.address(that.address);
			var e = that.instance.writeByte(that.triggerTempNHold);
			//console.log('write trigger temp'+e);
			setTimeout(that.readTemp, that.TempMeasurementTime);
		},

		readTemp: function() {
			var read = that.instance.address(that.address);
			//console.log('read'+read);
			that.tempBit = that.instance.read(2);
			//console.log(that.tempBit);

			that.caculateTemp();
		},

		caculateTemp: function() {

			//that.tempBit[1] = that.tempBit[1] & 0xFC+1;
			var p = that.tempBit[1]&0xFC;
			var t = that.tempBit[0] << 8;
			var cache = p + t ;
			//console.log(cache);

			that.tempVal = -46.85 + ( cache/Math.pow(2,16) )*175.72;

            if(that.tempVal > 0 && that.tempVal < 100) {
                // 如果数值正常，同步两个值
                // 如果一开始就不正常，等于100，直到正常为止
                that.tempEv = that.tempVal;
            } else {
                // 如果值不正常，令它等于前面那个
                console.log( '值不准，不准值为：'+ that.tempVal );
                that.tempVal = that.tempEv;
            } 
			//console.log(that.tempVal);
			//return that.tempVal;
		},

		getRh: function() {
			that.instance.address(that.address);
			that.instance.writeByte(that.triggerRhNHold);
			setTimeout(that.readRh, that.RH_Measurement_time);
		},

		readRh: function() {
			that.RhBit = that.instance.read(2);
			that.caculateRh();
		},

		caculateRh: function() {
			var p = that.RhBit[1]&0xFC;
			var t = that.RhBit[0] << 8;
			var cache = p + t; 
			that.RhVal = -6 + 125*( cache/65536 );
			//console.log('Rh val:'+that.RhVal);
			//return that.RhVal;
            if( that.RhVal > 0 && that.RhVal < 100 ) {
                that.RhEv = that.RhVal; 
            } else {
                console.log( '湿度不准值：'+ that.RhVal );
                that.RhVal = that.RhEv;
            }
		} ,

		softRest: function() {
			that.instance.address(that.address);
			var result = that.instance.writeByte(that.softResetCommand);
			if(result==0) {
				console.log('soft reset success!');
			}
			// also need to sleep sometime for sensor reset
		} ,

		readUserRegister: function() {
			that.instance.address(that.address);
			var t = that.instance.readReg(that.read_user_register_command);
			console.log(t);
			// var e = that.instance.writeByte(that.read_user_register_command);
			// console.log('read user register check'+e);
			// console.log(that.instance.read(1));
		} ,

		writeUserRegister: function() {
			//that.readUserRegister();
			that.instance.address(that.address);
			// var e = that.instance.writeByte(that.write_user_register_command);
			// //that.instance.address(that.address);
			// console.log('write user register check'+e);
			// var t = that.instance.writeByte(59);
			// console.log('result'+t);
			var t = that.instance.writeReg(that.write_user_register_command,parseInt('0x3b',16) );
			console.log(t);
		} ,

		getVal: function() {
			if(option.selection == 0) {
			   that.getTemperatrue();
			   //return that.tempVal;
			} else {
				that.getRh() ;
				//return that.RhVal;
			}
		}
	} ;

	return that.start;

}
