function save_options() {
  localStorage["keyid"] = document.getElementById("kid").value;
  localStorage["vcode"] = document.getElementById("vcode").value;
  localStorage["keyType"] = document.getElementById("keyType").innerText;
  localStorage["keyMask"] = document.getElementById("keyMask").innerText;
  localStorage["characterid"] = document.getElementById("chars").children[document.getElementById("chars").selectedIndex].value;
  localStorage["charactername"] = document.getElementById("chars").children[document.getElementById("chars").selectedIndex].innerHTML;
  if (document.getElementById('seconds').checked == true) {
      localStorage['seconds'] = 1000;
  } else{
      localStorage['seconds'] = 60000;
  }

  var status = document.getElementById("status");
  status.innerHTML = "Options Saved.";
  setTimeout(function() {
    status.innerHTML = "";
  }, 750);
}

// Restores select box state to saved value from localStorage.
function restore_options() {
  var kid = localStorage["keyid"];
  var vcode = localStorage["vcode"];
  var keyType = localStorage["keyType"];
  var keyMask = localStorage["keyMask"];
  var characterID = localStorage["characterid"];
  var characterName = localStorage["charactername"];
  if (!kid || !vcode || !characterID || !characterName) {
    return;
  }
  document.getElementById("kid").value = kid;
  document.getElementById("vcode").value = vcode;
  document.getElementById('keyMask').innerText = keyMask;
  document.getElementById('keyType').innerText = keyType;
  var character = document.createElement("option");
  character.value = characterID;
  character.innerHTML = characterName;
  document.getElementById("chars").appendChild(character);
  if (localStorage['seconds'] == 1000) {
      document.getElementById('seconds').checked = true;
  }
  showXml();
  showKeyInfo(keyMask,keyType);
}



function get_chars () {
var req = new XMLHttpRequest();

  var kid = document.getElementById("kid").value;
  var vcode = document.getElementById("vcode").value;
  document.getElementById("chars").innerHTML="";
  req.open("GET", "https://api.eveonline.com/account/APIKeyInfo.xml.aspx?"+"keyID="+kid+"&vCode="+vcode, true);
   req.onload = function(){
        var xml = req.responseXML;
        var chars = xml.getElementsByTagName('row');
        var keyInfo = xml.getElementsByTagName('key')[0];
        for (var i=0, row; row = chars[i]; i++) {
                var character = document.createElement("option");
                character.value = row.getAttribute("characterID");
                character.innerHTML = row.getAttribute("characterName");
                document.getElementById("chars").appendChild(character);
        }
        showKeyInfo(keyInfo.getAttribute('accessMask'), keyInfo.getAttribute('type'));
        document.getElementById('keyType').innerText = keyInfo.getAttribute('type');
        document.getElementById('keyMask').innerText = keyInfo.getAttribute('accessMask');
    };

   req.send(null);

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
        showXml();
    }



}

function showXml() {
    if (localStorage['lastUpdate']!=='')  {
        document.getElementById('last-upd').innerHTML = localStorage['lastUpdate'];
    }
}

function showKeyInfo(mask,type) {
    var parser = new DOMParser();
    var maskTail = 0;
    var keyInfo = document.getElementById('keyInfo');
    keyInfo.innerHTML = "";
    if (type == 'Account') type='Character';
    var callList = parser.parseFromString(localStorage['callList'],'application/xhtml+xml');
    var groups = callList.getElementsByTagName('rowset')[0].getElementsByTagName('row');
    var bits = callList.getElementsByTagName('rowset')[1].getElementsByTagName('row');
    for (var i=0, row; row = groups[i]; i++) {
        var catLi = document.createElement('li');
        catLi.innerText = row.getAttribute('name');
        catLi.setAttribute('title',row.getAttribute('description'));
        catLi.setAttribute('colspan','2');
        keyInfo.appendChild(catLi);
        var catUl = document.createElement('ul');
        catLi.appendChild(catUl);
        catUl.setAttribute('id','group'+row.getAttribute('groupID'));

    }
    for (var k=0, bitRow; bitRow = bits[k]; k++) {
        if (bitRow.getAttribute('type') == type){
            var bitLi = document.createElement('li');
            bitLi.innerText = bitRow.getAttribute('name');
            bitLi.setAttribute('title', bitRow.getAttribute('description'));
            document.getElementById('group'+bitRow.getAttribute('groupID')).appendChild(bitLi);
            maskTail = mask - bitRow.getAttribute('accessMask');
            if (maskTail >= 0){
                //alert(bitRow.getAttribute('accessMask')+' '+bitRow.getAttribute('name'));
                mask = maskTail;
                bitLi.setAttribute('class','enabled');
            } else {
                bitLi.setAttribute('class','disabled');
            }
        }
    }


}

document.addEventListener("DOMContentLoaded", function(){
    restore_options();
    document.getElementById("get_chars").addEventListener("click", get_chars);
    document.getElementById("update_xml").addEventListener("click", updateXml);
    document.getElementById("save_options").addEventListener("click", save_options);
});


