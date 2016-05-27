
// 定时发送模块

module.exports = function(option) {
    
    var that;

    that = {
        sendTime : option.sendTime?option.sendTime:'22:00:00',
        emailSender : require('./sendEmail.js'),
        //todayYMD : new Date().getD(2), // 当天的年月日 
        //sendEmailTimeStamp : new Date(that.todayYMD + ' ' + that.sendTime ),
        tryCount : 10,

        // some vars 

        sendEmail : function() {
            
            var now = new Date();
            var todayYMD = new Date().getD(2);
            var sendEmailTimeStamp = new Date( todayYMD + ' ' + that.sendTime );
            // 比较当前时间离发送时间还剩多少微秒
            var gap = sendEmailTimeStamp.getTime() - now.getTime() ;
            if( gap > 0 ) {

                console.log( 'today is not send , the gap is:'+gap ); 
                setTimeout( that.send, gap);
            } else {

                console.log( 'today had send, the gap is:'+(gap+24*1000*3600) ); 
                setTimeout( that.send, gap + 24*1000*3600 );
                //console.log( 'test tomorow' );
                //setTimeout( that.send, 4000 );
            }
        }, 

        send: function() {
            nowS = new Date();
            todayExcel = { path: '/media/' + nowS.getD(4) +'.xlsx', name: nowS.getD(4) + '.xlsx'  };

            that.emailSender( todayExcel.path, todayExcel.name, function( err, mes ) {

                if(err && that.tryCount>0) {
                    console.log('send email err, now have '+ that.tryCount+'times to send');
                    that.send();
                    that.tryCount-- ;
                } else {

                    that.tryCount = 10;
                    that.sendEmail(); // 今天发送成功后，继续触发新的定时
                    console.log('send success!');
                }
            }  ) ;
        },
        
        setSendTime: function(time) {
             
            that.sendTime = time;
            that.sendEmail();
        },
         
    };

    return that;

}
