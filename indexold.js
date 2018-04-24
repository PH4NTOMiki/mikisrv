var request = require('request');
var express = require('express')
var app = express();
var arrows={Flat:"\u2192",FortyFiveUp:"\u2197",FortyFiveDown:"\u2198",SingleUp:"\u2191",SingleDown:"\u2193",DoubleUp:"\u21C8",DoubleDown:"\u21CA"};var temp="";
 
function miki(){console.log("query started");
var url = 'https://mikicgm.herokuapp.com/api/v1/entries/sgv.json?count=1';
    request
      .get(url, (error, response, body) => {
if (body!==temp){console.log("!==");temp=body;var json = JSON.parse(body);handleResp(json);} else {console.log("===");}
});}

function sendMakerRequest(evname,value1,value2,value3){
var url = 'https://maker.ifttt.com/trigger/'+evname+'/with/key/oYprVEbFqUqMBP4hnl0XXux7MuC4lkozrvXdKGx05dL?value1='+encodeURIComponent(value1)+'&value2='+encodeURIComponent(value2)+'&value3='+encodeURIComponent(value3);
    request
      .get(url)
      .on('response', function (response) {
        console.info('sent maker request: ', url);
      })
      .on('error', function (err) {
});}

function handleResp(resp){
var rec=resp[0];var recTime=new Date(rec.date);var now=new Date();var minutesAgo=(now.getTime()-recTime.getTime())/(1000*60);
var delta=rec.delta/18;if (Math.abs(delta)<0.1 && Math.abs(delta)>0){delta=delta.toFixed(2);} else if (Math.abs(Number(delta.toFixed(1)))===0){delta="0"} else {delta=delta.toFixed(1)}if (delta.indexOf("-")===-1){delta="+"+delta}
var sgvString=(Math.round(rec.sgv/18*10)/10).toFixed(1);
var deltaString=arrows[rec.direction]+" "+delta;
var minsagoString=(minutesAgo+"").split(".")[0]+" mins ago";
sendMakerRequest("miki-cgmreading",sgvString,deltaString,minsagoString);
if (Number(sgvString)<=5.6){sendMakerRequest("miki-lowbg",sgvString,deltaString,minsagoString)
} else if (Number(sgvString)>=10){sendMakerRequest("miki-highbg",sgvString,deltaString,minsagoString)}}
 
miki();
setInterval(function(){miki()},10000);
 
 
app.set('port', (process.env.PORT || 5000))
app.use(express.static(__dirname + '/public'))
 
app.get('/', function(request, response) {
  response.send('Hello World!')
})
 
app.listen(app.get('port'), function() {
  console.log("Node app is running at localhost:" + app.get('port'))
})