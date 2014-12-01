var compteur = [];
var digit_del = ",";
var tabcouleurfind = new Array();
var parser = new DOMParser();
var skillTreeDoc = parser.parseFromString(localStorage['skills'],'application/xhtml+xml');
var conqStationsDoc = parser.parseFromString(localStorage['conqStations'],'application/xhtml+xml');
var apiserver = "https://api.eveonline.com";


var dateFin;
var currSkill;
var queue = [];
var trLevel;
var divTimeLeft;

var reqCharacterSheet = new XMLHttpRequest();
var reqSkillInTraining = new XMLHttpRequest();
var skillQueue = new XMLHttpRequest();
var ordersList = new XMLHttpRequest();
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
var mailMessages = new XMLHttpRequest();
var serverStatus = new XMLHttpRequest();
var paidUntil = new XMLHttpRequest();
=======
>>>>>>> 06f74e114a1f12f6538956e5bec594a8bf78454c
=======
>>>>>>> 06f74e114a1f12f6538956e5bec594a8bf78454c
=======
>>>>>>> 06f74e114a1f12f6538956e5bec594a8bf78454c
var vcode = localStorage["vcode"];
var keyid = localStorage["keyid"];
var characterid = localStorage["characterid"];
var cycleWait = localStorage['seconds'];


function init() {
    reqSkillInTraining.open("GET", apiserver + "/char/SkillInTraining.xml.aspx?keyID=" + keyid + "&characterID=" + characterid + "&vCode=" + vcode, true);
    reqSkillInTraining.onload = recupSkillInTraining;
    reqSkillInTraining.send(null);
    reqCharacterSheet.open("GET", apiserver + "/char/CharacterSheet.xml.aspx?keyID=" + keyid + "&characterID=" + characterid + "&vCode=" + vcode, true);
    reqCharacterSheet.onload = recupInfosPerso;
    reqCharacterSheet.send(null);
    ordersList.open("GET", apiserver + "/char/MarketOrders.xml.aspx?keyID=" + keyid + "&characterID=" + characterid + "&vCode=" + vcode, true);
    ordersList.onload = drawOrders;
    ordersList.send(null);
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    mailMessages.open("GET", apiserver + "/char/MailMessages.xml.aspx?keyID=" + keyid + "&characterID=" + characterid + "&vCode=" + vcode, true);
    mailMessages.onload = mailList;
    mailMessages.send(null);
    paidUntil.open("GET", apiserver + "/account/AccountStatus.xml.aspx?keyID=" + keyid + "&vCode=" + vcode, true);
    paidUntil.onload = accountStatus;
    paidUntil.send(null);
=======
>>>>>>> 06f74e114a1f12f6538956e5bec594a8bf78454c
=======
>>>>>>> 06f74e114a1f12f6538956e5bec594a8bf78454c
=======
>>>>>>> 06f74e114a1f12f6538956e5bec594a8bf78454c
    //id2name('1,2');
    window.setTimeout(function(){ window.location.reload() },600000);
}

function refreshDateFin() {
    compteur = differenceDates(queue[queue.length - 1][3]);
    if (differenceDates(dateFin)[3] <= 0) {
        var notification = webkitNotifications.createNotification('icon.png', // icon url - can be relative
        'Skill training complete', // notification title
        currSkill + ' ' + trLevel // notification body text
        );
        notification.show();
        location.reload();
    }
    chrome.browserAction.setBadgeText({
        text: compteur[0]
    });
    chrome.browserAction.setTitle({
        title: drawToolTip()
    });
    chrome.browserAction.setBadgeBackgroundColor({
        color: compteur[2]
    });
    setTimeout(function(){ refreshDateFin() },cycleWait )
}

function drawToolTip() {
    var ret = '';
    for (var i = 0; i < queue.length; i++) {
        ret = ret + getLibelleSkill(queue[i][0])[0] + ' ' + toRoman(queue[i][1]+' ') + ': ' + differenceDates(queue[i][3],cycleWait)[1] + '\n';
    }
    var ret2 = ret.slice(0, -1);
    return ret2;
}

function queueCalc() {
    var skills = skillQueue.responseXML.getElementsByTagName("row");
    var skillTable = document.createElement('table');
    for (var i = 0; i < skills.length; i++) {
        queue[i] = [];
        queue[i][0] = skills[i].getAttribute('typeID');
        queue[i][1] = parseInt(skills[i].getAttribute('level'));
        queue[i][2] = Date.parse(skills[i].getAttribute('startTime'));
        queue[i][2].addMinutes(new Date().getTimezoneOffset() * -1);
        queue[i][3] = Date.parse(skills[i].getAttribute('endTime'));
        queue[i][3].addMinutes(new Date().getTimezoneOffset() * -1);
        queue[i][4] = parseInt(skills[i].getAttribute('startSP'));
        queue[i][5] = parseInt(skills[i].getAttribute('endSP'));
        queue[i][6] = parseInt(getLibelleSkill(queue[i][0])[1]);
        var skillTr = document.createElement('tr');
        skillTr.setAttribute('skillId', skills[i].getAttribute('typeID'));
        skillTr.setAttribute('start', skills[i].getAttribute('startTime'));
        skillTr.setAttribute('end', skills[i].getAttribute('endTime'));
        skillTr.setAttribute('level', queue[i][1]);
        skillTr.setAttribute('rank', queue[i][6]);
        skillTr.setAttribute('from', queue[i][4]);
        skillTr.setAttribute('to', queue[i][5]);
        var tdSkillName = document.createElement('td');
        tdSkillName.innerHTML = getLibelleSkill(queue[i][0])[0]+'('+getLibelleSkill(queue[i][0])[1]+'x)';
        skillTr.appendChild(tdSkillName);

        var tdSkillInfo = document.createElement('td');
        tdSkillInfo.setAttribute('class', 'queueInfo');
        var skillImage = document.createElement('img');
        var imgSrc ="";
        if (i==0) {
            imgSrc = 'img/levelup'+queue[i][1]+'.gif';
        } else {
            imgSrc = 'img/levelupf'+queue[i][1]+'.gif';
        }
        skillImage.setAttribute('src', imgSrc);
        tdSkillInfo.appendChild(skillImage);
        tdSkillInfo.appendChild(document.createElement('br'));
        var progressDiv = document.createElement('div');
        progressDiv.setAttribute('class', 'progress');
        var progImg = document.createElement('img');
        progImg.setAttribute('src', 'img/prog.gif');
        progImg.setAttribute('width', '1%');
        progImg.setAttribute('height', '2px');
        progressDiv.appendChild(progImg);
        tdSkillInfo.appendChild(progressDiv);
        var timeTd = document.createElement('td');
        timeTd.setAttribute('class', 'queueTime')
        skillTr.appendChild(tdSkillInfo);
        skillTr.appendChild(timeTd);

        skillTable.appendChild(skillTr);
    }
    document.getElementById('idSkillInTraining').appendChild(skillTable);
    refreshDateFin();

}

function recupSkillInTraining() {
    var trainingTypeIDList = reqSkillInTraining.responseXML.getElementsByTagName("trainingTypeID");
    var trainingToLevelList = reqSkillInTraining.responseXML.getElementsByTagName("trainingToLevel");
    var trainingEndTimeList = reqSkillInTraining.responseXML.getElementsByTagName("trainingEndTime");
    var trainingBool = reqSkillInTraining.responseXML.getElementsByTagName("skillInTraining")[0].textContent;
    if (trainingBool == 1) {
        var trainingTypeIDElement = trainingTypeIDList[0];
        var trainingToLevelElement = trainingToLevelList[0];
        var trainingEndTimeElement = trainingEndTimeList[0];
        trLevel = toRoman(trainingToLevelElement.textContent + " ");


        currSkill = getLibelleSkill(trainingTypeIDElement.textContent)[0];
        var trainingEndTime = trainingEndTimeElement.textContent;
        dateFin = Date.parse(trainingEndTime);
        dateFin.addMinutes(new Date().getTimezoneOffset() * -1);
        skillQueue.open("GET", apiserver + "/char/SkillQueue.xml.aspx?keyID=" + keyid + "&characterID=" + characterid + "&vCode=" + vcode, true);
        skillQueue.onload = queueCalc;
        skillQueue.send(null);
    } else {
        alert("Warning! No Skill in training!");
        chrome.browserAction.setBadgeText({
            text: "warn"
        });
        chrome.browserAction.setBadgeBackgroundColor({
            color: [255, 0, 0, 255]
        });
    }
}





function getLibelleSkill(idSkill) {
    var currentTypes = skillTreeDoc.getElementsByTagName("row");
    var ret = [];

    for (var i = 0, row; row = currentTypes[i]; i++) {
        if (row.getAttribute("typeID") == idSkill && row.getAttribute("typeName") != null) {
            ret[0] = row.getAttribute("typeName");
            ret[1] = row.getElementsByTagName('rank')[0].textContent;
            ret[2] = row.getElementsByTagName('description')[0].textContent;
            return ret;
        }
    }
}

function toRoman(d) {
    switch (d) {
    case (d = '1 '):
        return 'I';
        break
    case (d = '2 '):
        return 'II';
        break
    case (d = '3 '):
        return 'III';
        break
    case (d = '4 '):
        return 'IV';
        break
    case (d = '5 '):
        return 'V';
        break
    }
}



function recupInfosPerso() {
    var name = reqCharacterSheet.responseXML.getElementsByTagName("name")[0].textContent;
    var balance = reqCharacterSheet.responseXML.getElementsByTagName("balance")[0].textContent;
    var corpName = reqCharacterSheet.responseXML.getElementsByTagName("corporationName")[0].textContent;
    var allyName = reqCharacterSheet.responseXML.getElementsByTagName("allianceName")[0].textContent;
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
        if ((allyName == undefined) || (allyName == ''))  { allyName = 'none';};
=======
>>>>>>> 06f74e114a1f12f6538956e5bec594a8bf78454c
=======
>>>>>>> 06f74e114a1f12f6538956e5bec594a8bf78454c
=======
>>>>>>> 06f74e114a1f12f6538956e5bec594a8bf78454c
    var rowsetList = reqCharacterSheet.responseXML.getElementsByTagName("rowset");
    var rowsetSkillsElement;

    var portrait = document.createElement('img');
    portrait.setAttribute('src', 'http://image.eveonline.com/Character/'+characterid+'_64.jpg');

    for (var i=0, rowset; rowset = rowsetList[i]; i++){
        if (rowset.getAttribute('name')=='skills'){
           rowsetSkillsElement = rowset;
        }
    }




    // Groups
    var listGroup = new Array();
    
    var groups = skillTreeDoc.getElementsByTagName("row");

    for (var i = 0, row; row = groups[i]; i++) {
        if (row.getAttribute("groupName") !== null && row.getAttribute("groupID") != null) {
            var tableGroup = document.createElement("table");
            tableGroup.setAttribute("idGroup", row.getAttribute("groupID"));
            var trHeaderGroup = document.createElement("tr");
            var thHeaderGroup = document.createElement("th");
            thHeaderGroup.setAttribute("colspan", 2);
            thHeaderGroup.className = "header";
            thHeaderGroup.innerText = row.getAttribute("groupName");
            tableGroup.setAttribute('spcount',0);
            tableGroup.setAttribute('skillcount',0);
            trHeaderGroup.appendChild(thHeaderGroup);
            tableGroup.appendChild(trHeaderGroup);
            listGroup.push(tableGroup);
        }
    }



    var tableSkills = document.createElement("table");
    var trHeader = document.createElement("tr");
    var thHeaderSkill = document.createElement("th");
    thHeaderSkill.innerText = "Skill";
    var thHeaderLevel = document.createElement("th");
    thHeaderLevel.innerText = "Level";

    trHeader.appendChild(thHeaderSkill);
    trHeader.appendChild(thHeaderLevel);

    //tableSkills.appendChild(trHeader);
    var skillList = rowsetSkillsElement.getElementsByTagName("row");
    var skillArr = [];
    for (var i = 0, row; row = skillList[i]; i++) {
        skillArr[i] = [];
        skillArr[i][1] = row.getAttribute("typeID");
        skillArr[i][0] = getLibelleSkill(row.getAttribute("typeID"))[0];
        skillArr[i][3] = getLibelleSkill(row.getAttribute("typeID"))[1];
        skillArr[i][2] = row.getAttribute("level");
        skillArr[i][4] = row.getAttribute("skillpoints");
        skillArr[i][5] = getLibelleSkill(row.getAttribute("typeID"))[2];
    }
    skillArr.sort();
    for (var i = 0, row; row = skillArr[i]; i++) {

        var trSkill = document.createElement("tr");
        trSkill.setAttribute('title',row[5]);
        var lvImg = document.createElement('img');
        var tdSkill = document.createElement("td");
        var tdLevel = document.createElement("td");
        var skillName = document.createElement('span');
        if (row[2] == 5) {
            tdSkill.style.background = 'url(img/skillBookComplete.png) no-repeat';
        } else {
            tdSkill.style.background = 'url(img/skillBookPartial.png) no-repeat';
        }
        trSkill.className = 'skill nd';
        tdSkill.className = 'skillName';
        tdLevel.className = 'skillLv';
        trSkill.setAttribute("idSkill", row[1]);
        trSkill.setAttribute("spCount", row[4]);
        var progressDiv = document.createElement('div');
        progressDiv.setAttribute('class', 'progress');
        var progImg = document.createElement('img');
        progImg.setAttribute('src', 'img/prog.gif');
        if (row[2] == 5) {
            skillName.innerHTML += row[0] + '(' + row[3] + 'x)<br>SP: ' + delim(row[4]);
            progImg.setAttribute('width', '100%');
        } else {
            skillName.innerHTML += row[0] + '(' + row[3] + 'x)<br><span id="sp'+row[1]+'">SP: ' + delim(row[4]) + '/' + delim(getMaxSP(parseInt(row[2])+1, row[3]));
            progImg.setAttribute('width', getCurrPrec(0,0,row[4],getMaxSP(parseInt(row[2])+1,row[3]),parseInt(row[2])+1,row[3])[0]+'%');
        }
        tdSkill.appendChild(skillName);
        lvImg.setAttribute('src', 'img/level' + row[2] + '.gif');
        lvImg.setAttribute('id','img'+row[1]);
        trSkill.appendChild(tdSkill);
        trSkill.appendChild(tdLevel);
        tdLevel.appendChild(lvImg);
        tdLevel.appendChild(document.createElement('br'));
        progImg.setAttribute('height', '2px');
        progImg.setAttribute('id', 'prog'+row[1]);
        progressDiv.appendChild(progImg);
        tdLevel.appendChild(progressDiv);
        placeSkillInTableGroup(trSkill, listGroup);
    }
    for (var i = 0, row; row = listGroup[i]; i++) {
        var sp = row.getAttribute('spCount');
        var skills = row.getAttribute('skillCount');
        var thSpan = document.createElement('span');
        thSpan.innerHTML = ' skills: '+delim(skills)+' SP: '+delim(sp);
        thSpan.className = 'spsumm';
        row.getElementsByTagName('th')[0].appendChild(thSpan);
    }

    document.getElementById("idName").innerText = name;
    document.getElementById("idCorp").innerText = corpName;
    document.getElementById("idAlly").innerText = allyName;
    document.getElementById("idBalance").innerText = delim(balance)+" ISK";
    document.getElementById('portrait').appendChild(portrait);


    for (var i = 0, row; row = listGroup[i]; i++) {
        if (row.childNodes.length > 1) {
            document.getElementById("idListeSkillsConnus").appendChild(row);
        }
    }
}


function placeSkillInTableGroup(trSkill, listGroup) {
    var idGroup = getGroupIDBySkillID(trSkill.getAttribute("idSkill"));
    var sp = parseInt(trSkill.getAttribute("spCount"));
    for (var i = 0, row; row = listGroup[i]; i++) {
        if (row.getAttribute("idGroup") == idGroup) {
            row.appendChild(trSkill);
            var lastSp = parseInt(row.getAttribute('spCount'));
            var currSp = lastSp+sp;
            row.setAttribute('spCount',currSp.toString());
            var lastSkills = parseInt(row.getAttribute('skillCount'));
            var currSkills = lastSkills+1;
            row.setAttribute('skillCount',currSkills.toString());
        }
    }
}

function getGroupIDBySkillID(idSkill) {
    var currentTypes = skillTreeDoc.getElementsByTagName("row");
    for (var i = 0, row; row = currentTypes[i]; i++) {
        if (row.getAttribute("typeID") == idSkill && row.getAttribute("typeName") != null) {
            return row.getAttribute("groupID");
        }
    }
}

function drawOrders() {
    var tIds = [];
    var sIds = [];
    var total = 0;
    var orders = [];
    orders = ordersList.responseXML.getElementsByTagName("row");
    if (orders.length>0) {

        for (var i=0, row; row = orders[i]; i++) {
            if (row.getAttribute('orderState')==0) {
                var orderTr = document.createElement('tr');
                var station = row.getAttribute('stationID');
                var type = row.getAttribute('typeID');
                var rem = row.getAttribute('volRemaining');
                var vol = rem+'/'+row.getAttribute('volEntered');
                var price = row.getAttribute('price');
                var dur = differenceDates(orderExpire(row.getAttribute('issued'),row.getAttribute('duration')),0)[4];
                var issued = row.getAttribute('issued');
                var summ = Math.round(price*rem);
                total = summ+total;
                sIds = distinctAdd(sIds,station);
                tIds = distinctAdd(tIds,type);
                orderTr.innerHTML = '<td class=\'s'+station+'\'></td><td class=\'t'+type+'\'></td><td>'+vol+'</td><td>'+delim(summ)+'</td><td>'+dur+'</td>';
                document.getElementById('ordersList').appendChild(orderTr);
            }

        }
        id2types(tIds);
        id2stNames(sIds);
        document.getElementById('ordersSumm').innerText = delim(total);
    }


}


function id2types(ids) {
    var id2nameReq = new XMLHttpRequest();
    var idsSrt = ids.join();
    id2nameReq.open("GET", apiserver + "/eve/typeName.xml.aspx?ids="+ids, false);
    id2nameReq.onload = function() {

       var res = id2nameReq.responseXML.getElementsByTagName('row');
        for (var i=0,row; row=res[i]; i++){
            for (var k=0, trow; trow=document.getElementsByClassName('t'+row.getAttribute('typeID'))[k]; k++) {

                trow.innerText = row.getAttribute('typeName');
            }
        }
    }
    id2nameReq.send(null);
}

function id2stNames(ids) {
    var sysRe = /^\S+\s\S+/;
    var npcS = new XMLHttpRequest();
    var pcS = conqStationsDoc.getElementsByTagName('row');
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
    npcS.open("GET","res/npcStations.xml", false);
=======
    npcS.open("GET","/res/npcStations.xml", false);
>>>>>>> 06f74e114a1f12f6538956e5bec594a8bf78454c
=======
    npcS.open("GET","/res/npcStations.xml", false);
>>>>>>> 06f74e114a1f12f6538956e5bec594a8bf78454c
=======
    npcS.open("GET","/res/npcStations.xml", false);
>>>>>>> 06f74e114a1f12f6538956e5bec594a8bf78454c
    npcS.onload = function() {

        var   res = npcS.responseXML;
         for (var k=0, irow; irow=ids[k]; k++) {
             for (var i=0,row; row=pcS[i]; i++){
                 if (irow==row.getAttribute('stationID')) {
                     for (var l=0, trow; trow=document.getElementsByClassName('s'+irow)[l]; l++) {
                         var stName = row.getAttribute('stationName');
                         trow.setAttribute('title',stName);
                         trow.innerText = stName.match(sysRe);

                     }
                     irow=0;
                 }
             }
             if (irow!==0) {
                 var b = res.getElementById(irow);
                 for (var l=0, trow; trow=document.getElementsByClassName('s'+irow)[l]; l++) {
                     var stName = b.getAttribute('stationName');
                     trow.setAttribute('title',stName);
                     trow.innerText = stName.match(sysRe);
                 }
             }
         }
    }
    npcS.send(null);

}

function distinctAdd(arr,val) {
    var has = 0;
    for (var i=0, row; row=arr[i]; i++){
        if (row==val) has = 1;
    }
    if (has==0) arr.push(val);
    return arr;
}
<<<<<<< HEAD
<<<<<<< HEAD
<<<<<<< HEAD
// start mail
function mailList() {
   var rows = mailMessages.responseXML.getElementsByTagName('row').length;
   var mailLists = [];
   var j = 0;
   for (var i=0; i<rows; i++){
        if (mailMessages.responseXML.getElementsByTagName('row')[i].getAttribute('senderID') !== characterid){
            mailLists[j] = mailMessages.responseXML.getElementsByTagName('row')[i];
            j++
        }
   }

    function sortBubble(mailLists) {
        var p = true;
        var tmp;
        while (p == true) {
             p = false;
                for (var i = 0; i < mailLists.length-1; i++) {
                     var a = new Date(mailLists[i].getAttribute('sentDate'));
                     var b = new Date(mailLists[i+1].getAttribute('sentDate'));
                        if ( a < b) {
                            tmp = mailLists[i];
                            mailLists[i] = mailLists[i+1];
                            mailLists[i+1] = tmp;
                            p = true;
                        }
                 }
            }
        return mailLists;
        }
    sortBubble(mailLists);
    
    if (mailLists.length > 10) {
        var mailsAmount = 10;
    } else {
        var mailsAmount = mailLists.length;
    }
    
    if (localStorage["lastMail"] == undefined){
        localStorage['lastMail'] = mailLists[0].getAttribute('sentDate'); 
        var lastMail = mailLists[0].getAttribute('sentDate');    
    } else {
        var lastMail = localStorage['lastMail'];
    }
    if(mailLists == 0) {
            var noMail = document.createElement('span');
            noMail.innerText = 'Have no mail';
            document.getElementById('count').appendChild(noMail);
    }
    for (var i=0; i<mailsAmount; i++){
        var mailID = mailLists[i].getAttribute('messageID');
        var echoinf = document.createElement('th');
        var table = document.createElement('table');
        var tr = document.createElement('tr');
        var sendDate = document.createElement('span');
        var trMailBody = document.createElement('tr');
        var tdMailTitle = document.createElement('td')
        var mailTitle = document.createElement('span')
        var toName = document.createElement('span');
        var name;
        var mailBody = document.createElement('span');
        var bodyText;
        var bodyStr;
        
        echoinf.setAttribute('id',mailID);
        echoinf.setAttribute('class','header');
        if (mailLists[i].getAttribute('sentDate') > lastMail) {
            echoinf.setAttribute('id','unread');
            chrome.browserAction.setIcon({
                path: "iconUnreadMail.png"
            });
            
        }

        echoinf.innerText = 'Sender: ' + mailLists[i].getAttribute('senderName');
        
        trMailBody.setAttribute('class', 'skill nd');
        
        mailTitle.setAttribute('id','mailTitle');
        
        if (mailLists[i].getAttribute('toCharacterIDs') == '') {
            var to = mailLists[i].getAttribute('toCorpOrAllianceID');
        } else {
            var to = mailLists[i].getAttribute('toCharacterIDs');
        }
        var toID = new XMLHttpRequest ()
        toID.open('GET', 'https://api.eveonline.com/eve/CharacterName.xml.aspx?ids=' + to, false);
        toID.onload = (function () { 
            name = toID.responseXML.getElementsByTagName('row')[0].getAttribute('name');
            return name;
            
            
        });
        toID.send(null);
        
        var mailR = new XMLHttpRequest ();
        mailR.open('GET', "https://api.eveonline.com/char/MailBodies.xml.aspx?keyID=" + keyid + "&characterID=" + characterid + "&vCode=" + vcode + "&ids=" + mailID , false);
        mailR.onload = (function () {
           bodyText = mailR.responseXML.getElementsByTagName("row")[0].childNodes[0].nodeValue;
           return bodyText;

        });
        mailR.send(null);
        
        sendDate.setAttribute('class','time');
        
        tdMailTitle.appendChild(mailTitle).innerText = mailLists[i].getAttribute('title');
        tdMailTitle.appendChild(sendDate).innerHTML = '<br>' + mailLists[i].getAttribute('sentDate');
        tdMailTitle.appendChild(toName).innerHTML = '<br>To: ' + name;
        tdMailTitle.appendChild(mailBody).innerHTML = '<br><br>' + bodyText;
        tdMailTitle.setAttribute('class', 'skillName');


        
        trMailBody.appendChild(tdMailTitle);
        
        
        document.getElementById('mail').appendChild(table).appendChild(tr).appendChild(echoinf).appendChild(trMailBody);
        

        
        }
}
//end mail
//start account and server statuses
function accountStatus() {
    var currentTimeS = paidUntil.responseXML.getElementsByTagName('currentTime')[0].textContent;
    var paidS = paidUntil.responseXML.getElementsByTagName('paidUntil')[0].textContent;
    var currentTime = new Date(currentTimeS);
    var paid = new Date(paidS);
    var daysToExpire = Math.floor((paid - currentTime )/ (24 * 60 * 60 * 1000));
    var hoursToExpire = Math.floor(((paid - currentTime ) - (daysToExpire*24*60*60*1000))/(60*60*1000) )
    var timeSpan = document.createElement('span');
    var serverStatusS;
    serverStatus.open("GET", apiserver + "/server/ServerStatus.xml.aspx", false);
    serverStatus.onload = (function (){
        var serverOpen = serverStatus.responseXML.getElementsByTagName('serverOpen')[0].textContent;
        if (serverOpen == 'True') {
            var players = serverStatus.responseXML.getElementsByTagName('onlinePlayers')[0].textContent;
            serverStatusS = '<span id="serverOn">Online </span>' + players + ' players';
        } else {
            serverStatusS = '<span id="serverOff">Offline</span>';
        }
        return serverStatusS;
    });
    serverStatus.send(null);
    
    
    timeSpan.innerHTML = '<span id="PLEX">PLEX </span>will expire after: ' + daysToExpire +'d ' + hoursToExpire + 'h; ' + serverStatusS;
    document.getElementById('status').appendChild(timeSpan);

    
}
//end

if (document.addEventListener)
    document.addEventListener("DOMContentLoaded", init, false);
    
=======
=======
>>>>>>> 06f74e114a1f12f6538956e5bec594a8bf78454c
=======
>>>>>>> 06f74e114a1f12f6538956e5bec594a8bf78454c


if (document.addEventListener)
    document.addEventListener("DOMContentLoaded", init, false);
<<<<<<< HEAD
<<<<<<< HEAD
>>>>>>> 06f74e114a1f12f6538956e5bec594a8bf78454c
=======
>>>>>>> 06f74e114a1f12f6538956e5bec594a8bf78454c
=======
>>>>>>> 06f74e114a1f12f6538956e5bec594a8bf78454c
