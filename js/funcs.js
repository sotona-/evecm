var msPerDay = 24 * 60 * 60 * 1000;
var msPerHour = 60 * 60 * 1000;
var msPerMinutes = 60 * 1000;
var msPerSeconds = 1000;
var digit_del = ",";

function differenceDates(d,cw) {
    var dateNow = new Date();
    var stop = 0;
    var ret = [];
    ret[1] = "";
    ret[4] = "";
    var timeBetween = d.valueOf() - dateNow.valueOf();
    ret[3] = timeBetween;
    var jours = Math.floor(timeBetween / msPerDay);
    if (jours > 0) {
        timeBetween = timeBetween - (jours * msPerDay);
        ret[0] = jours + "d";
        ret[1] = jours + " days,  ";
        ret[2] = [30, 60, 150, 230];
        ret[4] = jours + "d ";
        stop = 1;
    }

    var heures = Math.floor(timeBetween / msPerHour);
    if (heures > 0) {
        timeBetween = timeBetween - (heures * msPerHour);
        ret[1] = ret[1] + heures + " hours,  ";
        ret[4] = ret[4] + heures + "h ";
        if (stop == 0) {
            ret[0] = heures + "h";
            ret[2] = [255, 20, 20, 230];
            stop = 1;
        }
    }

    var minutes = Math.floor(timeBetween / msPerMinutes);
    if (minutes > 0) {
        timeBetween = timeBetween - (minutes * msPerMinutes);
        ret[1] = ret[1] + minutes + " mins "
        ret[4] = ret[4] + minutes + "m ";
        if (stop == 0) {
            ret[0] = minutes + "m";
            ret[2] = [255, 20, 20, 230];
            
            stop = 1;
        }
    }
    if (cw==1000) {
        var secondes = Math.floor(timeBetween / msPerSeconds);
        if (secondes > 0) {
            timeBetween = timeBetween - (secondes * msPerSeconds);
            ret[1] = ret[1] + secondes + " sec"
            ret[4] = ret[4] + secondes + "s";
            if (stop == 0) {
                ret[0] = secondes + "s";
                ret[2] = [255, 20, 20, 230];
            }
        }
    }

    return ret;
}

function orderExpire(start,dur){
    var startDate = Date.parse(start);
    startDate.addMinutes(new Date().getTimezoneOffset() * -1);
    startDate.addDays(dur);
    return startDate;
}

function getMaxSP(lv, rank) {
    return Math.ceil(Math.pow(2, ((2.5 * parseInt(lv)) - 2.5)) * 250 * rank);

}




function getCurrPrec(start,end,from,to,lv,rank) {
    var ret = [];
    var now = new Date();
    if ( (start==0 && end==0) || (start.getTime() > now.valueOf()) ) {
        var curr = from;
    } else {
        var speed = (to-from)/(end.valueOf() - start.valueOf());
        var curr =  Math.ceil(speed*(now.valueOf() - start.valueOf()))+from;
    }
    var deltaLv = getMaxSP((lv),rank) - getMaxSP((lv-1),rank);
    var currDeltaLv = curr - getMaxSP((lv-1),rank);
    ret[0] = Math.ceil(currDeltaLv/deltaLv*100);
    ret[1] = curr;
    return ret;
}

function delim(st) {
    var trSt = st + '';
    return trSt.replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1' + digit_del);
}
