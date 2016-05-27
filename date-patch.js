  Date.prototype.getD = function(s, n) {
    var y = this.getFullYear().toString().substr(2,2);
    //y = y.substr(2,2);
    //var d = (this.getDate+1 <10)?'0'+this.getDate():this.getDate();
    var cache = [this.getMonth() + 1, this.getDate(), this.getHours(),this.getMinutes(),this.getSeconds()];
    for(var i = 0; i < cache.length; i++) {
      cache[i] = cache[i] < 10 ? '0'+cache[i]: cache[i];
    }
    if(s==1) {
      return cache[2]+':'+cache[3]+':'+cache[4];
    } else if(s==2){
        return this.getFullYear().toString() +'-'+cache[0]+'-'+ cache[1];
    } else if(s==3) {
        return this.getFullYear.toString() + '-' + cache[0] + '-' + cache[1]+n;
    } else if(s==4) {
        return y+'-'+cache[0]+'-'+cache[1];
    }
    return y+'-'+cache[0]+'-'+cache[1]+' '+cache[2]+':'+cache[3]+':'+cache[4];

  }
