if(game_data.player.sitter>0){URLReq=`game.php?t=${game_data.player.id}&screen=place&mode=scavenge_mass`;}
else{URLReq="game.php?&screen=place&mode=scavenge_mass";}
var scavengeInfo=[];var categoryNames;var html="";var lowestDurationVillage=null;var lowestDuration=Infinity;var lowestDurationString="";var lowestDurationEndTime=null;cssClassesSophie=`
      <style>
      tr.sophRowA > td.sophHeader,
      tr.sophRowB > td.sophHeader
       {
      white-space: nowrap;
      }
    
      .sophRowA {
      background-color: #32353b;
      color: white;
      padding:8px;
        font-size: 11px;
        text-align: center;
      }
    
      .sophRowB {
      background-color: #36393f;
      color: white;
      padding:8px;
      font-size: 11px;
        text-align: center;
      }
    
      .sophHeader {
      background-color: #202225;
      color: white;
      padding:8px;
      font-size: 11px;
          text-align: center;
      }
    
    @media (max-width: 768px) {
      tr {
          font-size: 9px; 
        }
      }
    
      .lowestDurationVillage {
          color: #d00000;
      }
    
      .lowestDurationMessage {
          font-size: 11px;
      }
    
      .lowestDurationValue {
          color: #d00000;
      }
    
      </style>`
$(".content-border").eq(0).prepend(cssClassesSophie);$("#mobileHeader").eq(0).prepend(cssClassesSophie);$.getAll=function(urls,onLoad,onDone,onError){var numDone=0;var lastRequestTime=0;var minWaitTime=200;loadNext();function loadNext(){if(numDone==urls.length){onDone();return;}
let now=Date.now();let timeElapsed=now-lastRequestTime;if(timeElapsed<minWaitTime){let timeRemaining=minWaitTime-timeElapsed;setTimeout(loadNext,timeRemaining);return;}
console.log('Getting ',urls[numDone]);$("#progress").css("width",`${(numDone+1)/urls.length*100}%`);lastRequestTime=now;$.get(urls[numDone]).done((data)=>{try{onLoad(numDone,data);++numDone;loadNext();}catch(e){onError(e);}}).fail((xhr)=>{onError(xhr);})}};URLs=[];$.get(URLReq,function(data){if($(data).find(".paged-nav-item").length>0){amountOfPages=parseInt($(data).find(".paged-nav-item")[$(data).find(".paged-nav-item").length-1].href.match(/page=(\d+)/)[1]);}
else{amountOfPages=0;}
console.log("Amount of pages: "+amountOfPages);categoryNames=JSON.parse("["+$(data).find('script:contains("ScavengeMassScreen")')[0].innerHTML.match(/\{.*\:\{.*\:.*\}\}/g)+"]")[0];for(var i=0;i<=amountOfPages;i++){URLs.push(URLReq+"&page="+i);tempData=JSON.parse($(data).find('script:contains("ScavengeMassScreen")').html().match(/\{.*\:\{.*\:.*\}\}/g)[0]);duration_exponent=tempData[1].duration_exponent;duration_factor=tempData[1].duration_factor;duration_initial_seconds=tempData[1].duration_initial_seconds;}
console.log(URLs);}).done(function(){let message="";html="<div><table class='sophHeader'><tr class='sophHeader'><td class='sophHeader'colspan='5'>"+message+"</td></tr><tr class='sophHeader'><td class='sophHeader'>Village</td><td class='sophHeader'>1</td><td class='sophHeader'>2</td><td class='sophHeader'>3</td><td class='sophHeader'>4</td></tr>";arrayWithData="[";$.getAll(URLs,(i,here)=>{thisPageData=$(here).find('script:contains("ScavengeMassScreen")').html().match(/\{.*\:\{.*\:.*\}\}/g)[2];arrayWithData+=thisPageData+",";},()=>{arrayWithData=arrayWithData.substring(0,arrayWithData.length-1);arrayWithData+="]";scavengeInfo=JSON.parse(arrayWithData);$.each(scavengeInfo,function(villageNr){if(villageNr%2==0){rowClass='class="sophRowA"'}
else{rowClass='class="sophRowB"'}
html+=`<tr ${rowClass}><td class="sophHeader">${scavengeInfo[villageNr].village_name}</td>`;$.each(scavengeInfo[villageNr]["options"],function(villageCategoryNr){if(scavengeInfo[villageNr]["options"][villageCategoryNr]["scavenging_squad"]!=null){endTime=parseInt(scavengeInfo[villageNr]["options"][villageCategoryNr]["scavenging_squad"]["return_time"])*1000;duration=(endTime-Date.now())/1000;durationString=new Date(duration*1000).toISOString().substr(11,8);console.log(`Duration: ${durationString} (${duration} seconds)`);let backgroundColor='';if(duration<15*60){backgroundColor='background-color: #e85d04;';console.log('Applying background color: #e85d04');}else if(duration<45*60){backgroundColor='background-color: #faa307;';console.log('Applying background color: #faa307');}
html+=`<td ${rowClass} style="${backgroundColor}"><span class="timer" data-endtime=${parseInt(endTime/1000)}>${durationString}</span></td>`;if(duration<lowestDuration){lowestDuration=duration;lowestDurationVillage=scavengeInfo[villageNr].village_name;lowestDurationString=durationString;lowestDurationEndTime=parseInt(endTime/1000);}}
else{let backgroundColor=scavengeInfo[villageNr]["options"][villageCategoryNr]["is_locked"]!=true?'background-color: #d00000;':'';let cellText=scavengeInfo[villageNr]["options"][villageCategoryNr]["is_locked"]!=true?'No run':'LOCKED';html+=`<td ${rowClass} style="${backgroundColor}">${cellText}</td>`;}})
html+="</tr>";})
message=`<div class="lowestDurationMessage"><h2 class="lowestDurationMessage">The village with the lowest remaining duration is <span class="lowestDurationVillage">${lowestDurationVillage}</span> with a duration of <span class="timer lowestDurationValue" data-endtime=${lowestDurationEndTime}>${lowestDurationString}</span>.</h2></div>`;html=html.replace("<td class='sophHeader'colspan='5'></td>",`<td class='sophHeader'colspan='5'>${message}</td>`);html+="</table></div>";$("#contentContainer").eq(0).prepend(html);$("#mobileContent").eq(0).prepend(html);Timing.tickHandlers.timers.init();},(error)=>{console.error(error);});})