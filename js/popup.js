<<<<<<< HEAD

var queueTrList = [];

function init() {
    if (((localStorage['vcode'] !== '') || (localStorage['keyid'] !== '')) && ((localStorage['vcode'] !== undefined) || (localStorage['keyid'] !== undefined))) {
=======
var queueTrList = [];

function init() {
>>>>>>> 06f74e114a1f12f6538956e5bec594a8bf78454c
    var res = chrome.extension.getBackgroundPage().document.getElementById('main');
    document.getElementById('i').innerHTML = res.innerHTML;
    $("th.header").live('click', function(){
           $(this).parent().parent().find('tr.skill').toggleClass("nd");
<<<<<<< HEAD
           if ($(this).is('#unread')) {
                $(this).attr('id','read');
                    chrome.browserAction.setIcon({
                        path: "icon.png"
                    });  
                    localStorage['lastMail'] = $(this).parent().parent().find('tr.skill').find('td.skillName').find('span.time').text();             
                
           }
=======
>>>>>>> 06f74e114a1f12f6538956e5bec594a8bf78454c
    });
    var queueDiv = document.getElementById('idSkillInTraining');
    queueTrList = queueDiv.getElementsByTagName('tr');
    updateCounters();
    initTabs();
<<<<<<< HEAD
} else 
    document.getElementById('i').innerHTML = 'invalid vCode or keyID <br> <a target="_blank" href="chrome-extension://eiiimmjkmakohhdfdjhkdochlcggocko/options.html">Open Settings</a>';
=======
>>>>>>> 06f74e114a1f12f6538956e5bec594a8bf78454c
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
}
if (document.addEventListener)
    document.addEventListener("DOMContentLoaded", init, false);
