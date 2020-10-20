
var d = new Date();
console.log(d.getFullYear());
console.log(d.getMonth());
console.log(d.getDate());

var stateCodes = ['ak','al','ar','as','az','ca','co','ct','dc','de','fl','ga','gu','hi','ia','id','il','in','ks','ky','la','ma','md','me','mi','mn','mo','mp','ms','mt','nc','nd','ne','nh','nj','nm','nv','ny','oh','ok','or','pa','pr','ri','sc','sd','tn','tx','ut','va','vi','vt','wa','wi','wv','wy'];
var states = ['Alaska', 'Alabama', 'Arkansas', 'American Samoa', 'Arizona', 'California', 'Colorado', 'Connecticut', 'District of Columbia', 'Delaware', 'Florida',
    'Georgia', 'Guam', 'Hawaii', 'Iowa', 'Idaho', 'Illinois', 'Indiana', 'Kansas', 'Kentucky', 'Louisiana', 'Massachusetts', 'Maryland', 'Maine', 'Michigan',
    'Minnesota', 'Missouri', 'Northern Mariana Islands', 'Mississippi', 'Montana', 'North Carolina', 'North Dakota', 'Nebraska', 'New Hampshire', 'New Jersey',
    'New Mexico', 'Nevada', 'New York', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Puerto Rico', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee','Texas', 
    'Utah', 'Virginia', 'Virgin Islands', 'Vermont', 'Washington', 'Wisconsin', 'West Virginia', 'Wyoming'];
var populations = [731545, 4903185, 3017804, 49437, 7278717, 39512223, 5758736, 3565287, 705749, 973764, 21477737, 
    10617423, 168485, 1415872, 3155070, 1787065, 12671821, 6732219, 2913314, 4467673, 4648794, 6892503, 6045680, 1344212, 9986857,
    5639632, 6137428, 51433, 2976149, 1068778, 10488084, 762062, 1934408, 1359711, 8882190, 
    2096829, 3080156, 19453561, 11689100, 3956971, 4217737, 12801989, 3193694, 1059361, 5148714, 884659, 6829174, 28995881,
    3205958, 8535519, 106235, 623989, 7614893, 5822434, 1792147, 578759]
var sevenDayCases = [];
var dailyCasesPer100k = [];
var positivityRate = [];
var needToQuarantine = [];
var needToQuarantineStrings = [];

async function getNumbers() {
    for(var i=0; i<56; i++) {
        $.ajax({
            url : "https://api.covidtracking.com/v1/states/" + stateCodes[i] + "/daily.json",
            success : function(result){
                //get seven day case total
                var sevenDayCaseTotal = result[0].positiveIncrease+result[1].positiveIncrease+result[2].positiveIncrease+result[3].positiveIncrease+result[4].positiveIncrease+result[5].positiveIncrease+result[6].positiveIncrease;
                sevenDayCases.push(sevenDayCaseTotal);
                dailyCasesPer100k.push((sevenDayCaseTotal / populations[i] * 100000 / 7).toFixed(2));
                if(states[i]=="Massachusetts") console.log(sevenDayCaseTotal)

                //get positive cases
                var positive = result[0].positive;
                var total = result[0].totalTestResults;
                positivityRate.push((positive / total).toFixed(2));
            },
            async: false
        });
    }
}

getNumbers().then(function() {
    for(var i=0; i<56;i++) {
        if((dailyCasesPer100k[i] >= 10) || (positivityRate[i] > 0.10)) {
            needToQuarantine[i] = true;
        }
        else {
            needToQuarantine[i] = false;
        }
    }

    //update table
    var table = document.getElementById("table");
    for(var i=55; i>=0; i--) {
        var row = table.insertRow(1);
        var cell1 = row.insertCell(0);
        var cell2 = row.insertCell(1);
        var cell3 = row.insertCell(2);
        cell1.innerHTML = states[i];
        cell2.innerHTML = dailyCasesPer100k[i];
        cell3.innerHTML = positivityRate[i];
        //set red or green
        console.log(needToQuarantine[i])
        if(needToQuarantine[i] == true) {
            row.classList.add("red");
        }
        else {
            row.classList.add("green");
        }
    }
});






  