
// [>jslint node:true, vars:true, bitwise:true, unparam:true <]
// [>jshint unused:true <]
// // Leave the above lines for propper jshinting
// //Type Node.js Here :)

//require('./boot');

require('./date-patch');
mraa = require('mraa');

var sht20 = require('./sht20');

var sensor = require('./sensor');

sensor0 = sensor({port:0,computeValue: function( rawValue ) { return rawValue*100; },  threshold:{up:30,down:15}});
sensor1 = sensor({port:1, computeValue: function( rawValue ) { return rawValue*1000; },  threshold:{up:0.8,down:0.3} }); 
//sensor2 = sensor({port:2,threshold:{up:0.8,down:0.3} });
//sensor3 = sensor({port:3,threshold:{up:0.8,down:0.3} });
sensor4 = sensor({port:2, computeValue: function( rawValue ) { return rawValue*(-230)+235; }, threshold:{up:0.8,down:0.3} });
sensor5 = sensor({port:3, computeValue: function( rawValue ) { return rawValue*(-2000)+2000; }, threshold:{up:0.8,down:0.3} });

sensor2 = sensor({i2c:true, selection:2, threshold:{up:30,down:15}, updateTime:4000,driver:sht20({bus:0, selection:0})() }); 
sensor3 = sensor({i2c:true, selection:1, threshold:{up:30,down:15}, updateTime:3000,driver:sht20({bus:0, selection:1})() }); 



// {0:weight,1:light,2:temperatrue,3:humidity,4:NH3,5:co2 }
sensor0.start();
sensor1.start();
sensor4.start();
sensor5.start();

// 2位i2c 
sensor2.start();
sensor3.start();

var actuator = require('./actuator');
actuator1 = actuator({port:2,relySensor:[1],threshold:[0,1]});
//actuator2 = actuator({port:3,relySensor:[2],threshold:[0,1]});
// threshold to be 1
//actuator3 = actuator({port:4,relySensor:[3]});
//actuator4 = actuator({port:6,relySensor:[4]});
//actuator5 = actuator({port:7,relySensor:[5]});

actuator1.start();
//actuator2.start();
//actuator3.start();
// actuator4.start();
// actuator5.start();



// var servo = require('./servo');
// servo1 = servo({port:5,relySensor:0});
// servo1.start();



var ubidots = require('ubidots');
var client = ubidots.createClient('0559ba2a343a8980b16c5b8e8e4e6635dc73fe09');
client.auth(function () {

	//var ds = this.getDatasource('5663dec77625421b3c0ac60b');

// {0:weight,1:light,2:temperatrue,3:humidity,4:NH3,5:co2 }
    try {  
        Utemperatrue = this.getVariable('5663df2e7625421b79f0c840');
        Ulight = this.getVariable('5663e9b876254231c9bed7be');
        Uco2 = this.getVariable('5663ea1d762542300bcb57fa');
        UNH3 = this.getVariable('5663eaaa762542330013f997');
        Uhumidity = this.getVariable('5663eb677625423594bf16d1');
        Uweight = this.getVariable('5663eb95762542338ec79794');
    } catch( err ){
        console.log(err);
    }

    UsaveData = function() {
        try { 
            Uweight.saveValue(sensor0.rawValue);
            Ulight.saveValue(sensor1.rawValue);
            Utemperatrue.saveValue(sensor2.rawValue);
            Uhumidity.saveValue(sensor3.rawValue);
            UNH3.saveValue(sensor4.rawValue);
            Uco2.saveValue(sensor5.rawValue);
        } catch( err ) {
            console.log(err);
        }
            
        console.log('rescue upload data to ubidots');
        setTimeout( UsaveData, 5000 );
    }

    setTimeout( UsaveData, 5000 );

    // setTimeout( global.UsaveData, 5000 );
    

});

setTimeout( global.UsaveData, 10000 );


// 每个sensor自带了当前值，每个执行器自带了控制状态


// 向node发送更新
// var ip2 = 'http://192.168.1.106:3000';
// var ip1 = 'http://192.168.0.102:3000';
// var ip3 = 'http://192.168.1.113:3000';
// var haitou = 'http://192.168.0.100:3000';

var sockect = require('socket.io-client')(hosts.sockectHost);

sockect.on('connect', function() {
    console.log('i have connect to the server');
    sockect.emit('addEdison', {user_id: 'user_id:27'}); //连接后向中转服务器发送信息
});

sockect.on('error', function(err) {
    console.log('sockect error!,is:'+err);
});



function updateData() {
    var date = new Date().getD(0);
    var data = { 
        user_id: 'user_id:27',
        data: { 
            'sensor_id:44': {value: sensor5.rawValue, date: date },
            'sensor_id:45': {value: sensor4.rawValue, date: date},
            'sensor_id:46': {value: sensor1.rawValue, date: date},
            'sensor_id:47': { value: sensor0.rawValue, date: date },
            'sensor_id:48': { value: sensor2.rawValue, date: date },
            'sensor_id:49': { value: sensor3.rawValue, date: date }

        }
    };
    
    sockect.emit('updateData', data);
    console.log( 'rescue update socket data' );
    setTimeout( updateData, 6000 );
}

// 6s向中转socket发送一次数据
//setInterval(updateData, 6000);
setTimeout( updateData, 6000 );

// // {0:weight,1:light,2:temperatrue,3:humidity,4:NH3,5:co2 }


//global.saveDataHandle = '';
var saveExcelTimes = 0;
// //var exec = require('child_process').exec;
function saveExcel(callback) {

    var argData = ' ' + sensor5.rawValue + ' ' + sensor1.rawValue + ' ' + sensor4.rawValue + ' ' + sensor2.rawValue + ' ' + sensor3.rawValue + ' ' + sensor0.rawValue;
    saveExcelTimes++;
    console.log( 'now try to save excel' + saveExcelTimes + 'times, argData is:'+argData );

    exec('python ~/iot/createExcel.py' + argData, function(err) {
        if(err) {
            console.info('exe python err:' );
        } else {
            console.log('save excel success!');
        }

        setTimeout( saveExcel, env.excelTime);
    });
}

setTimeout( saveExcel, 10000);

// 发送邮件定时
var sendEmailHander = require('./sendEmailByTime')( { sendTime: '08:42:00' } );
sendEmailHander.sendEmail();

sockect.on('configEdison', function(data) {

    try{ 
         
        console.log('user try to config edison, data is:'+data);
        // 清除excel文件定时存储时钟，并重新定时
        //clearInterval(saveDataHandle);
        //delete global.saveDataHandle;
        env.excelTime = parseFloat(data.excel)*1000*3600;
        //global.saveDataHandle = setInterval(saveExcel, env.excelTime);
        // 重新设定发送email时间
        env.emailTime = data.sendEmailTime;
        sendEmailHander.setSendTime( env.emailTime );
        // 重新设置全局变量，email今天没有发送，发送错误为0
        console.log('now edison is config success, env is'+env);

        sockect.emit('configSuccess', { userId: data.userId });
    
    } catch(err) {
        console.log(err);
    }

});

