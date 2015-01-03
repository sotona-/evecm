if (((localStorage['vcode'] !== '') || (localStorage['keyid'] !== '')) && ((localStorage['vcode'] !== undefined) || (localStorage['keyid'] !== undefined))) {
var queueTrList = [];
var unreadArr = JSON.parse(localStorage['unreadArr']);
var vcode = localStorage["vcode"];
var keyid = localStorage["keyid"];
var characterid = localStorage["characterid"];


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
                localStorage.unreadArr = JSON.stringify(unreadArr);
                var amountOfUnread = parseInt(document.getElementById('unread'+tof).textContent);
                $('span#unread'+tof).html(amountOfUnread-1);
                localStorage['unread'+tof] = amountOfUnread-1; 
                if ((localStorage['unread1'] == 0) && (localStorage['unread2'] == 0) && (localStorage['unread3'] == 0)) {
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
        localStorage['unread1'] = 0;
        localStorage['unread2'] = 0; 
        localStorage['unread3'] = 0;  
        chrome.browserAction.setIcon({
            path: "icon.png"
        }); 
        unreadArr = {};
        localStorage.unreadArr = JSON.stringify(unreadArr);
        var parentElement = document.getElementById('tab4');
        var elementToRemove = document.getElementById('markAllAsRead');
        parentElement.removeChild(elementToRemove);

    });
    var queueDiv = document.getElementById('idSkillInTraining');
    queueTrList = queueDiv.getElementsByTagName('tr');
    updateCounters();
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
        document.getElementById('unread1').innerText = localStorage['unread1'];
        document.getElementById('unread2').innerText = localStorage['unread2'];
        document.getElementById('unread3').innerText = localStorage['unread3'];
            if ((localStorage['unread1']>0)||(localStorage['unread2']>0)||(localStorage['unread3']>0)) {
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
if (document.addEventListener)
    document.addEventListener("DOMContentLoaded", init, false);
} else {
    var str = '<span>invalid vCode or keyID<span> <br> <a target="_blank" href="chrome-extension://eiiimmjkmakohhdfdjhkdochlcggocko/options.html">Open Settings</a>';
    $(document).ready(function (){$('div#i').html(str);});
}
