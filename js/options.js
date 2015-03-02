

function save_options() {
  var charNum = this.getAttribute('charN');
  localStorage["keyid_"+charNum] = document.getElementById("kid_"+charNum).value;
  localStorage["vcode_"+charNum] = document.getElementById("vcode_"+charNum).value;
  localStorage["characterid_"+charNum] = document.getElementById("chars_"+charNum).children[document.getElementById("chars_"+charNum).selectedIndex].value;
  localStorage["charactername_"+charNum] = document.getElementById("chars_"+charNum).children[document.getElementById("chars_"+charNum).selectedIndex].innerHTML;
  localStorage['seconds'] = 60000;
  if (!localStorage['mainChar']){
    localStorage['mainChar'] = charNum;
  }
  var status = document.getElementById("status_"+charNum);
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
  restore_options();
}

// Restores select box state to saved value from localStorage.
function restore_options() {
for (var count = 1;count<4;count++) {
  var kid = localStorage["keyid_"+count];
  var vcode = localStorage["vcode_"+count];
  var characterID = localStorage["characterid_"+count];
  var characterName = localStorage["charactername_"+count];
  if (!kid || !vcode || !characterID || !characterName) {
    
  } else {
  document.getElementById("kid_"+count).value = kid;
  document.getElementById("vcode_"+count).value = vcode;

  var charImage = document.createElement('img');
  charImage.setAttribute('src', 'http://image.eveonline.com/Character/'+characterID+'_128.jpg');
  document.getElementById('charImage_'+count).innerHTML = '';
  document.getElementById('charImage_'+count).appendChild(charImage);
  var character = document.createElement("option");
  character.value = characterID;
  character.innerHTML = characterName;
  document.getElementById("chars_"+count).appendChild(character);
  if (localStorage['seconds'] == 1000) {
      document.getElementById('seconds').checked = true;
  }
  showXml();
    }
  }
}
function updateXml () {
    var d = new Date();
    var skills = new XMLHttpRequest();
    var stations = new XMLHttpRequest();
    var callList = new XMLHttpRequest();
    stations.open("GET", "https://api.eveonline.com/eve/ConquerableStationList.xml.aspx", true);
    skills.open("GET", "https://api.eveonline.com/eve/SkillTree.xml.aspx", true);
    callList.open("GET", "https://api.eveonline.com/api/CallList.xml.aspx", true);
    stations.send(null);

    stations.onload = function (){
        localStorage['conqStations'] = stations.responseText;
        skills.send(null);
    }
    skills.onload = function (){
        localStorage['skills'] = skills.responseText;
        callList.send(null);
    }
    callList.onload = function(){
        localStorage['callList'] = callList.responseText;
        localStorage['lastUpdate'] = d.toLocaleString();
    }
}



function get_chars () {
var th = this;
var charNum = this.getAttribute('charN');
var req = new XMLHttpRequest();

  var kid = document.getElementById("kid_"+charNum).value;
  var vcode = document.getElementById("vcode_"+charNum).value;
  document.getElementById("chars_"+charNum).innerHTML="";
  req.open("GET", "https://api.eveonline.com/account/APIKeyInfo.xml.aspx?"+"keyID="+kid+"&vCode="+vcode, true);
   req.onload = function(){
        var xml = req.responseXML;
        var chars = xml.getElementsByTagName('row');
        var keyInfo = xml.getElementsByTagName('key')[0];
        for (var i=0, row; row = chars[i]; i++) {
                var character = document.createElement("option");
                character.value = row.getAttribute("characterID");
                character.innerHTML = row.getAttribute("characterName");
                document.getElementById("chars_"+charNum).appendChild(character);
        }

    };

   req.send(null);

}

function deleteChar() {
    var charNum = this.getAttribute('charN');
    if (!localStorage["keyid_"+charNum] || !localStorage["vcode_"+charNum] || !localStorage["characterid_"+charNum] || !localStorage["charactername_"+charNum]){
        return;
    } else {
        var mainDiv = document.createElement('span');
        var accept = document.createElement('div');
        var cancel = document.createElement('div');
        var span = document.createElement('span');
        mainDiv.setAttribute('id','deleteDiv_'+charNum);
        span.innerText = "Are you sure?";
        accept.setAttribute('class','accept');
        accept.innerText = 'Yes';
        cancel.setAttribute('class','cancel');
        cancel.innerText = 'No';
        mainDiv.appendChild(cancel);
        mainDiv.appendChild(accept);
        mainDiv.appendChild(span);
        document.getElementById('status_'+charNum).appendChild(mainDiv);
        accept.addEventListener('click', function(){
            if (charNum == localStorage['mainChar']){
                localStorage.removeItem('mainChar');
                for (var i=1; i<4;i++) {
                    if ((localStorage['vcode_'+i] != undefined) && (localStorage['keyid_'+i] != undefined)) {
                        localStorage['mainChar'] = i;
                        chrome.extension.sendMessage('123', function(backMessage){
                            if (backMessage = '1'){

                            } 
                        });
                        break; 
                    }
                }
            }
            var deleteDiv = document.getElementById('deleteDiv_'+charNum);
            deleteDiv.parentNode.removeChild(deleteDiv);
            localStorage.removeItem('keyid_'+charNum);
            localStorage.removeItem('characterid_'+charNum);
            localStorage.removeItem('charactername_'+charNum);
            localStorage.removeItem('tOfLastRM_'+charNum);
            localStorage.removeItem('unread1_'+charNum);
            localStorage.removeItem('unread2_'+charNum);
            localStorage.removeItem('unread3_'+charNum);
            localStorage.removeItem('unreadArr_'+charNum);
            localStorage.removeItem('vcode_'+charNum);
            window.location.reload();
        });  
        cancel.addEventListener('click', function(){
            var deleteDiv = document.getElementById('deleteDiv_'+charNum);
            deleteDiv.parentNode.removeChild(deleteDiv);

        });
    }
}






function showXml() {
    if (localStorage['lastUpdate']!=='')  {
        for (var i = 1; i<4;i++){
        document.getElementById('last-upd_'+i).innerHTML = localStorage['lastUpdate'];
        }
    }
}



document.addEventListener("DOMContentLoaded", function(){
    restore_options();
    updateXml();
    document.getElementById("get_chars_1").addEventListener("click", get_chars);
    document.getElementById("get_chars_2").addEventListener("click", get_chars);
    document.getElementById("get_chars_3").addEventListener("click", get_chars);
    document.getElementById("save_options_1").addEventListener("click", save_options);
    document.getElementById("save_options_2").addEventListener("click", save_options);
    document.getElementById("save_options_3").addEventListener("click", save_options);
    document.getElementById("delete_1").addEventListener("click", deleteChar);
    document.getElementById("delete_2").addEventListener("click", deleteChar);
    document.getElementById("delete_3").addEventListener("click", deleteChar);
});


