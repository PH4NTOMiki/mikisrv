var request = require('request');
var express = require('express')
var app = express();
var arrows={Flat:"\u2192",FortyFiveUp:"\u2197",FortyFiveDown:"\u2198",SingleUp:"\u2191",SingleDown:"\u2193",DoubleUp:"\u21C8",DoubleDown:"\u21CA"};var tempdate=3589420;var isEmpty=false;
var keyval=process.env.keyvalue || "errcode";var keyValue=keyval+"";
var timeint=process.env.intervaltime || 10000;var intervalTime=Number(timeint);
var lowbgset=process.env.lowbg || 5.6;var lowbgSetting=Number(lowbgset);
var highbgset=process.env.highbg || 10;var highbgSetting=Number(highbgset);

 
function miki(){console.log("query started");
var url = 'https://mikicgm.herokuapp.com/pebble';
    request
      .get(url, (error, response, body) => {var json = JSON.parse(body);if (json.bgs.length==0){if (isEmpty==false){isEmpty=true;
var lastTime=new Date(tempdate);var nowTime=new Date();var minutesAgoTime=(nowTime.getTime()-lastTime.getTime())/(1000*60);
var lastRead=(tempdate==3589420)?"unknown":(minutesAgoTime+"").split(".")[0]+" mins ago";sendMakerRequest("miki-cgmreading","ERROR:","NO SGV","Last reading received: "+lastRead);}} else if (json.bgs[0].datetime != tempdate){console.log("!=");isEmpty=false;tempdate=json.bgs[0].datetime;handleResp(json);} else {console.log("==");isEmpty=false;}
});}

function sendMakerRequest(evname,value1,value2,value3){
var url = 'https://maker.ifttt.com/trigger/'+evname+'/with/key/'+keyValue+'?value1='+encodeURIComponent(value1)+'&value2='+encodeURIComponent(value2)+'&value3='+encodeURIComponent(value3);
    request
      .get(url)
      .on('response', function (response) {
        console.info('sent maker request: ', url);
      })
      .on('error', function (err) {
		console.info('error while sending maker request: '+url+' , '+err);
});}

function handleResp(resp){
var rec=resp.bgs[0];var recTime=new Date(rec.datetime);var now=new Date();var minutesAgo=(now.getTime()-recTime.getTime())/(1000*60);
var delta=rec.bgdelta;if (delta.indexOf("-")===-1){delta="+"+delta}
var sgvValue=rec.sgv;
var deltaArrow=arrows[rec.direction]+" "+delta;
var minsago=(minutesAgo+"").split(".")[0]+" mins ago";
var iob=rec.iob+"u";
sendMakerRequest("miki-cgmreading",sgvValue,deltaArrow,iob);
if (Number(sgvValue)<=lowbgSetting){sendMakerRequest("miki-lowbg",sgvValue,deltaArrow,iob)
} else if (Number(sgvValue)>=highbgSetting){sendMakerRequest("miki-highbg",sgvValue,deltaArrow,iob)}}
 
if (keyValue!="errcode"){console.info("key is set, start operation");miki();
var firstInterval=setInterval(function(){miki()},intervalTime);
app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.get('/', function(request, response) {
  response.send('Hello World!')
})
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})} else {console.info("ERROR: key is not set, STOP");
app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
app.get('/', function(request, response) {
  response.send('ERROR: key is not set!')
})
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})
}