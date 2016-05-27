
// a class for sensors 


module.exports = function(option) {
	var that;

	that = {
		port: option.port ,
		i2c: option.i2c?option.i2c: false,
		value: '' ,
		instance: {} ,
		rawValue: 0 ,
		linear: 1, //0 represent negertive linear
		statu: 1 , // it has threee status ,they are low,middle ,high, ex: 1 is middle
		threshold: {
			up: option.threshold.up?option.threshold.up:0.8,
			down: option.threshold.down?option.threshold.down:0.3
		} ,
		isOn:0, // if the sensor is on
		updateTime:option.updateTime?option.updateTime:3500,
        selection: option.selection?option.selection:1000,
        computeValue: option.computeValue?option.computeValue:null,

		// flowing are the function for one each sensor

		// compute the sensor value statu (low, middle, high)

		computeStatu: function() {
			//if(that.isOn) {
            if(that.linear == 1) {
                if(that.rawValue < that.threshold.down) {
                    that.statu = 0;
                    //console.log('kdfdsjkf');
                } else if(that.rawValue > that.threshold.up) {
                    that.statu = 2; 
                } else {
                    that.statu = 1;
                } 
            } else {
                if(that.rawValue < that.threshold.down) {
                    that.statu = 2;
                } else if(that.rawValue >that.threshold.up) {
                    that.statu = 0;
                } else {
                    that.statu = 1;
                }
            }
			// } else {
				// console.log('snesor is starting');
			// }
		} ,
		getRawValue: function() {
			that.rawValue = that.instance.readFloat();
		},
		computeValueP: function() {
			// 如果设置了计算value表达式就使用它(compute value for every instance)
            console.log('run compute value');
			that.rawValue = that.computeValue(that.rawValue);

		} ,
		start: function() {
			if(!that.i2c) {
				that.analogStart();
			} else {
				that.i2cStart();
			}
		} ,
		analogStart: function() {
			that.instance = new mraa.Aio(that.port);
			//that.isOn = 1;
			//setInterval(that.update , that.updateTime);
            setTimeout(that.update, that.updateTime)
		},

		i2cStart: function() {
			that.instance = option.driver;
			//console.log(that.instance);
			//that.isOn = 1;
			//setInterval(that.updateI2c, that.updateTime);
            setTimeout(that.updateI2c, that.updateTime)
		} ,

		updateI2c: function() {
            // 触发测量 
            //that.instance.getVal();

            if( that.selection == 2 ) {
                that.instance.getTemperatrue();
                that.rawValue = that.instance.tempVal;
            } else if(that.selection == 1){
                that.instance.getRh();
                that.rawValue = that.instance.RhVal;
            }
            
			//that.computeStatu();
			console.log('I2c selection is:'+that.selection+'statu is:'+that.statu+'value is:'+that.rawValue);
            setTimeout(that.updateI2c, that.updateTime)
		},

		update: function() {
			that.getRawValue();
			that.computeStatu();
			that.computeValueP();

			console.log('A port is:'+that.port+';statu is:'+that.statu+'value is:'+that.rawValue);
            setTimeout(that.update, that.updateTime)
		}


	} ;

	return that;
}
