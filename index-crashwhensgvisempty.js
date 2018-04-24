var request = require('request');
var express = require('express')
var app = express();
var arrows={Flat:"\u2192",FortyFiveUp:"\u2197",FortyFiveDown:"\u2198",SingleUp:"\u2191",SingleDown:"\u2193",DoubleUp:"\u21C8",DoubleDown:"\u21CA"};var tempdate=3589420;
var keyval=process.env.keyvalue;var keyValue=keyval+"";
var timeint=process.env.intervaltime;var intervalTime=Number(timeint);
var lowbgset=process.env.lowbg;var lowbgSetting=Number(lowbgset);
var highbgset=process.env.highbg;var highbgSetting=Number(highbgset);

 
function miki(){console.log("query started");
var url = 'https://mikicgm.herokuapp.com/pebble';
    request
      .get(url, (error, response, body) => {var json = JSON.parse(body);
if (json.bgs[0].datetime != tempdate){console.log("!=");tempdate=json.bgs[0].datetime;handleResp(json);} else {console.log("==");}
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
 
miki();
var firstInterval=setInterval(function(){miki()},intervalTime);
 
 
app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
 
app.get('/', function(request, response) {
  response.send('Hello World!')
})
 
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})