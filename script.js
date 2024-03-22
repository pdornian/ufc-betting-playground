document.addEventListener('DOMContentLoaded', function() {
    const bouts = [];

    // Format the raw input strings into something useful
    for(const boutString of boutStrings) {
        const b = boutString.split(",");
        bouts.push({
            nameA:b[0],
            nameB:b[1],
            oddsA:b[2],
            oddsB:b[3],
            winner:b[8] === "Red" ? b[0] : b[1],
        })
    }

    // For now just output some rows to confirm the data was correctly parsed
    const test = document.getElementById("test-results");
    console.log(test);
    const startIndex = Math.floor(Math.random() * boutStrings.length);
    for (var x = startIndex; x < Math.min(startIndex + 50, boutStrings.length); x++) {
        const p = document.createElement("h3");
        const v = bouts[x];
        p.textContent = "" + v.nameA + " " + v.oddsA + " vs " + v.nameB + " " + v.oddsB + " winner:" + v.winner;
        test.appendChild(p);
    }

}, false);
