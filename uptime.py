# 2.7版本用http.lib
import httplib as http
import time
import os

def get_time(host):
    conn=http.HTTPConnection(host)
    conn.request("GET", "/")
    r=conn.getresponse()
    ts=  r.getheader('date') 
    ltime= time.strptime(ts[5:25], "%d %b %Y %H:%M:%S")
    print(ltime)
    ttime=time.localtime(time.mktime(ltime)+8*60*60)
    print(ttime)
    dat="date %u-%02u-%02u"%(ttime.tm_year,ttime.tm_mon,ttime.tm_mday)
    tm="time %02u:%02u:%02u"%(ttime.tm_hour,ttime.tm_min,ttime.tm_sec)
    print (dat,tm)
    print(ts)
    now = " '" + dat + " " + tm + "'"
    print(now)
    os.system("date -s" + now)

get_time('www.baidu.com')
