#!/usr/bin/env node 

/*
 * 这是启动文件，需要做的事情有：获取网络时间，并且对edison设置，获取laravel接口下的数据库文件下的定时配置，配置好当天的excel文件名。
 * env = { 'excelTime': [保存到数据库的时间], 'emailTime': [每天发送email时间],   }
 */

var http = require('http');
var qs = require('querystring');

// 全局比变量
env = {excelTime: 5000, emailTime: '22:00:00'}; // 50s 保存一次excel文件
hosts = {webHost: '52.77.124.186', sockectHost: 'http://52.77.124.186:3000'};
//hosts = {webHost: '192.168.0.100', sockectHost: 'http://192.168.0.100:3000'};
var timeoutNum = { db: 10, uptime:10 };

function getDbData(callback) {
    var data = {
        userId: 27,
    };
    var content = qs.stringify(data);

    var options = {
        hostname: hosts.webHost,
        port: 81,
        path: '/iot/manage/edisonData?' + content,
        method: 'GET',
    };

    var req = http.request( options, function (res) {
        res.setEncoding('utf-8');
        res.on('data', function(chunk) {
            console.log('web server body' + chunk);
            var allData = eval( "(" + chunk + ")" )[0]; //因为服务器端返回是一个多维
            env.excelTime = parseFloat(allData.excel)*1000*3600;
            env.emailTime = allData.sendEmailTime;
            console.log('response to web server, now env is :');
            console.log(env);
            callback();
             
        });
    } );

    req.on('error', function(e) {
        console.log('error:'+e);
        if( timeoutNum.db-- > 0 ) {
            console.log('try connect to web server');
            getDbData();
        } else {
            console.log('had try ,but fail ,run callback');
            callback();
        }
    });

    req.end();
}


exec = require('child_process').exec;

function setSysTime() {
    
    exec('python ~/iot/uptime.py', function (err) {
        if(err) {
            if(timeoutNum.uptime-- > 0) {
                setSysTime();
            }
            console.log(err);
            console.log('i have try'+ timeoutNum.uptime+'times, but fail the end');
        } else {
            console.log('set system time success');
        }
    });
}

setSysTime();
// 在确保拉下成功后，加载boot.js文件
getDbData( function() { require('./boot.js'); } );
