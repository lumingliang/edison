import pyexcel as pe
from datetime import datetime
import pyexcel.ext.xlsx
import os

import sys

#content = "1,2,3\n3,4,5"
#  a = []
#  sheet = pe.get_sheet(array=a)
#  sheet.row += ["time/value", "co2", "light", "NH3", "temperature", "humidity", "voice"]
#sheet.format(int)
#print(sheet.to_array())
#sheet.save_as("data.xlsx")

def doCreate(path):
    a = []
    sheet = pe.get_sheet(array=a)
    sheet.row += ["time/val", "co2", "light", "NH3", "temp", "humidity", "voice"]
    sheet.save_as(path)


def addExcel(path, nowtime):
    sheet = pe.get_sheet(file_name = path)
    
    oneRow = [nowtime]
    if len(sys.argv)>0:
	print("test")
	for i in range(1, len(sys.argv)):
	    oneRow.append(sys.argv[i])
    sheet.row += oneRow
    sheet.save_as(path)


def createExcel(namePrefix):
    today = datetime.now()
    #print(today.strftime("%y-%m-%d"))
    #prefix = "/media/sdcard/"
    #prefix2 = "/media/"
    #prefix = "~/iot/data/"
    #prefix = "/media/"
    #prefix = ""
    excelName = namePrefix + today.strftime("%y-%m-%d") + ".xlsx"
    #excelName2 = prefix2 + today.strftime("%y-%m-%d") + ".xlsx"
    nowtime = today.strftime("%X")
    print(excelName)
    if os.path.exists(excelName):
        print('i aleady exit')
    else:
        print(excelName)
        doCreate(excelName)
        #doCreate(excelName2)
    addExcel(excelName, nowtime)
    #addExcel(excelName2, nowtime)
    
createExcel('/media/')
createExcel('/media/sdcard/')
#doCreate("16-03-21.xlsx")

