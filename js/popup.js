if (localStorage['mainChar']!=undefined) {
var queueTrList = [];
var mainChar = localStorage['mainChar'];
var unreadArr = JSON.parse(localStorage['unreadArr_'+mainChar]);
var vcode = localStorage["vcode_"+mainChar];
var keyid = localStorage["keyid_"+mainChar];
var characterid = localStorage["characterid_"+mainChar];


function init() {
    
    var res = chrome.extension.getBackgroundPage().document.getElementById('main');
    document.getElementById('i').innerHTML = res.innerHTML;
    $("th.header").live('click', function(){
           $(this).parent().parent().find('tr.skill').toggleClass("nd");

           if ($(this).is('#unread')) {
                $(this).attr('id','read');

                var messageID = $(this).attr('messid');
                var tof = $(this).attr('tof');
                delete unreadArr[messageID];
                localStorage['unreadArr_'+mainChar] = JSON.stringify(unreadArr);
                var amountOfUnread = parseInt(document.getElementById('unread'+tof).textContent);
                $('span#unread'+tof).html(amountOfUnread-1);
                localStorage['unread'+tof+'_'+mainChar] = amountOfUnread-1; 
                if ((localStorage['unread1_'+mainChar] == 0) && (localStorage['unread2_'+mainChar] == 0) && (localStorage['unread3_'+mainChar] == 0)) {
                    chrome.browserAction.setIcon({
                        path: "icon.png"
                    });
                    var parentElement = document.getElementById('tab4');
                    var elementToRemove = document.getElementById('markAllAsRead');
                    parentElement.removeChild(elementToRemove);                     
                                    
                }
           }

    });
    $('div#markAllAsRead').live('click', function(){
        $('th#unread').each(function(){
            $(this).attr('id','read');
           
            
        });
        $('span#unread1').html('0');
        $('span#unread2').html('0');
        $('span#unread3').html('0');
        localStorage['unread1_'+mainChar] = 0;
        localStorage['unread2_'+mainChar] = 0; 
        localStorage['unread3_'+mainChar] = 0;  
        chrome.browserAction.setIcon({
            path: "icon.png"
        }); 
        unreadArr = {};
        localStorage['unreadArr_'+mainChar] = JSON.stringify(unreadArr);
        var parentElement = document.getElementById('tab4');
        var elementToRemove = document.getElementById('markAllAsRead');
        parentElement.removeChild(elementToRemove);

    });

    var queueDiv = document.getElementById('idSkillInTraining');
    queueTrList = queueDiv.getElementsByTagName('tr');
    updateCounters()
    initTabs();
    setUnread();
    mailBodyInit();



}




function updateCounters() {
    for (var i=0,row; row = queueTrList[i]; i++) {
        var start = Date.parse(row.getAttribute('start'));
        var end = Date.parse(row.getAttribute('end'));
        start.addMinutes(new Date().getTimezoneOffset() * -1);
        end.addMinutes(new Date().getTimezoneOffset() * -1);
        row.getElementsByTagName('td')[2].innerHTML = differenceDates(end,1000)[4];
        var spPrec = getCurrPrec(start,end,parseInt(row.getAttribute('from')),parseInt(row.getAttribute('to')),parseInt(row.getAttribute('level')),parseInt(row.getAttribute('rank')));
        row.getElementsByTagName('img')[1].setAttribute('width', spPrec[0]+'%');
        var listSpItem = document.getElementById('sp'+row.getAttribute('skillId')).innerHTML;
        document.getElementById('sp'+row.getAttribute('skillId')).innerHTML = replaceSP(listSpItem,delim(spPrec[1]));
        document.getElementById('img'+row.getAttribute('skillId')).setAttribute('src',row.getElementsByTagName('img')[0].getAttribute('src'));
        document.getElementById('prog'+row.getAttribute('skillId')).setAttribute('width',spPrec[0]+'%');

    }
    setTimeout(function(){ updateCounters() },1000);
}

function replaceSP(st,rp) {
    return st.replace(/(SP:\s)([\d|,]+)(.+)/g,'$1'+rp+'$3');
}

function initTabs() {
    //When page loads...
	$(".tab_content").hide(); //Hide all content
	$("ul.tabs li:first").addClass("active").show(); //Activate first tab
	$(".tab_content:first").show(); //Show first tab content

	//On Click Event
	$("ul.tabs li").click(function() {

		$("ul.tabs li").removeClass("active"); //Remove any "active" class
		$(this).addClass("active"); //Add "active" class to selected tab
		$(".tab_content").hide(); //Hide all tab content

		var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
		$(activeTab).show(); //Fade in the active ID content
		return false;
	});
    
        //When page loads...
	$(".mail_content").hide(); //Hide all content
	$("ul.mailtabs li:first").addClass("active").show(); //Activate first tab
	$(".mail_content:first").show(); //Show first tab content

	//On Click Event
	$("ul.mailtabs li").click(function() {

		$("ul.mailtabs li").removeClass("active"); //Remove any "active" class
		$(this).addClass("active"); //Add "active" class to selected tab
		$(".mail_content").hide(); //Hide all tab content

		var activeTab = $(this).find("a").attr("href"); //Find the href attribute value to identify the active tab + content
		$(activeTab).show(); //Fade in the active ID content
		return false;
	});
}
function setUnread () {

    $('th.header').each(function(){
        var messageID = $(this).attr('messid');
        if (unreadArr[messageID] == 'unread'){
            $(this).attr('id','unread');
        }
        
    });
        document.getElementById('unread1').innerText = localStorage['unread1_'+mainChar];
        document.getElementById('unread2').innerText = localStorage['unread2_'+mainChar];
        document.getElementById('unread3').innerText = localStorage['unread3_'+mainChar];
            if ((localStorage['unread1_'+mainChar]>0)||(localStorage['unread2_'+mainChar]>0)||(localStorage['unread3_'+mainChar]>0)) {
        var markAsRead = document.createElement('div');
        var divToMark = document.getElementById('tab4');
        markAsRead.setAttribute('id','markAllAsRead');
        markAsRead.innerText = 'Mark all as read';
        divToMark.appendChild(markAsRead);
        }
}
function mailBodyInit () {
    $("th.header").click( function(){
        var load = $(this).attr('load');
        if (load != 'true') {
            load = 'false'
        }
        var mailID = $(this).attr('messid');
        var mailBody = document.createElement('span');
        var mailR = new XMLHttpRequest ();

        if ((load == 'false')||(load == undefined) ){
        mailR.open('GET', "https://api.eveonline.com/char/MailBodies.xml.aspx?keyID=" + keyid + "&characterID=" + characterid + "&vCode=" + vcode + "&ids=" + mailID , false);
        mailR.onload = (function () {
        bodyText = mailR.responseXML.getElementsByTagName("row")[0].childNodes[0].nodeValue;
        return bodyText;
        });
        mailR.send(null);
        document.getElementById(mailID).appendChild(mailBody).innerHTML = '<br><br>' + bodyText;
        load = 'true';
        $(this).attr('load', load);
        }

    });
}
function charSelect () {
    var str1 = '<center>Select<img src="img/down.png">Character</center>';
    var str2 = '<center>Close<img src="img/up.png">Tab</center>';
    document.getElementById('open').innerHTML = str1;
    $('.open').click(function(){
        $('#charSelect').slideToggle(750);
        if (document.getElementById('open').innerHTML == str1){
            document.getElementById('open').innerHTML = str2;   
        } else {
            document.getElementById('open').innerHTML = str1;    
        }   
    });
    
    for (var i = 1;i<4;i++){
        var kid = localStorage["keyid_"+i];
        var vcode = localStorage["vcode_"+i];
        var characterID = localStorage["characterid_"+i];
        var characterName = localStorage["charactername_"+i];
        if (!kid || !vcode || !characterID || !characterName) {
            var charImg = document.createElement('img');
            var a = document.createElement('a');
            document.getElementById('char'+i).removeChild(document.getElementById('char'+i).childNodes[0]);
            charImg.setAttribute('src','img/'+i+'.jpg');
            $('#char'+i).find('#imgHover').attr('title','Add Character');
            a.setAttribute('target','_blank');
            a.setAttribute('href','chrome-extension://eiiimmjkmakohhdfdjhkdochlcggocko/options.html');
            a.setAttribute('id','addChar');
            a.setAttribute('title','Add New Character');
            a.setAttribute('charN',i);
            a.appendChild(charImg);
            document.getElementById('char'+i).appendChild(a);
            a.addEventListener("mouseover",function(){
                a.childNodes[0].setAttribute('src','img/plus.jpg');
            });
            a.addEventListener("mouseleave",function(){
                a.childNodes[0].setAttribute('src','img/'+this.getAttribute('charN')+'.jpg');
            });
    
        } else {
            var charImg = document.createElement('img');
            charImg.setAttribute('src', 'http://image.eveonline.com/Character/'+characterID+'_64.jpg');
            charImg.setAttribute('title',localStorage["charactername_"+i]);
            $('#char'+i).find('#imgHover').attr('title',localStorage["charactername_"+i]);
            document.getElementById('char'+i).appendChild(charImg);
            document.getElementById('char'+i).addEventListener("click",function(){
                var time = document.getElementById('time').textContent;
                localStorage['mainChar'] =  this.getAttribute('charN');
                document.getElementById('i').innerHTML = '';
                document.getElementById('i').innerHTML = '<div id="loading">Loading, please wait.</div>';        
                    chrome.extension.sendMessage('123', function(backMessage){
                        if (backMessage = '1'){
                            function check() {
                                var time2 = chrome.extension.getBackgroundPage().document.getElementById('time');
                                if ((time2.textContent != time) && (time2.textContent != undefined) && (time2.textContent != '')){
                                    init();
                                } else {
                                    setTimeout(function(){ check() }, 1000);
                                }
                            }
                            check();
                        }   
                    });       
            });
        }    
    }
}
if (document.addEventListener)
    document.addEventListener("DOMContentLoaded",function (){ 
        init();
        charSelect()
    }, false);
} else {
    var str = '<span>No character is defined<span> <br> <a target="_blank" href="chrome-extension://eiiimmjkmakohhdfdjhkdochlcggocko/options.html">Open Settings</a>';
    $(document).ready(function (){$('div#i').html(str);});
}
