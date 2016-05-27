
var email 	= require("emailjs/email");
var sendEmail = function(excelPath, excelName, callback) {

var server 	= email.server.connect({
   user:    "18186493126@163.com", 
   password:"cushlogphcobxvlm", 
   host:    "smtp.163.com", 
   prot: 25,
   ssl:     true,
   timeout: 60000,
});
 
// send the message and get a callback with an error or details of the message that was sent 
server.send({
   text:    "this is the dayly data of your sensors", 
   from:    "18186493126@163.com",
   to:      "156448398@qq.com", // 331053988@qq.com
   subject: "edison data" ,
   attachment: 
   [
      {data:"<html>i <i>hope</i> this works!</html>", alternative:true},
      {path:excelPath , type:"application/xlsx", name:excelName}
   ]
}, function(err, message) { 
    //console.log(err || message);
    callback(err,message);
    // if(err) {
        // return false;
    // } else {
        // return true;
    // }
});


}
module.exports = sendEmail;
//sendEmail();
//setInterval(sendEmail, 4000);
