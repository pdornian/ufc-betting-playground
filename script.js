function parseBoutStrings() {
    const output = [];

    // Format the raw input strings into something useful
    for(const boutString of boutStrings) {
        const b = boutString.split(",");
        output.push({
            nameA:b[0],
            nameB:b[1],
            oddsA:b[2],
            oddsB:b[3],
            winner:b[8] === "Red" ? b[0] : b[1],
        })
    }
    return output;
}

function showTestResults(bouts) {
    const test = document.getElementById("results");
    console.log(test);
    const startIndex = Math.floor(Math.random() * boutStrings.length);
    for (var x = startIndex; x < Math.min(startIndex + 5, boutStrings.length); x++) {
        const p = document.createElement("h3");
        const v = bouts[x];
        p.textContent = "" + v.nameA + " " + v.oddsA + " vs " + v.nameB + " " + v.oddsB + " winner:" + v.winner;
        test.appendChild(p);
    }
}

/**
 * Returns the net change after betting on the underdog for this bout.
 * If the odds are even then do not bet and return 0.
 *
 * Example 1: bet underdog and favorite wins: net loss
 * Uriah Hall 245.0 vs Paulo Costa -290 winner:Paulo Costa
 * Lose 100 bet so return -100
 *
 * Example 2: bet underdog and underdog wins: net win
 * Paul Felder -170.0 vs Mike Perry 150 winner:Mike Perry
 * Return 150 profit (get 100 bet back +150)
 */
function betUnderdog(bout) {
    if (bout.oddsA === bout.oddsB) {
        return 0;
    }

    // Lose case: the favorite won so return -100
    if ((bout.oddsA < bout.oddsB && bout.winner === bout.nameA) || (bout.oddsB < bout.oddsA && bout.winner === bout.nameB)) {
        return -100;
    }

    // Win case: the underdog won so return underdog odds
    return Math.max(bout.oddsA, bout.oddsB);
}

function show(text) {
    const results = document.getElementById("results");
    const p = document.createElement("h3");
    p.textContent = "" + text;
    results.appendChild(p);
}

function main() {
    const bouts = parseBoutStrings();

    const showParsingTestResults = false;
    if (showParsingTestResults) {
        showTestResults(bouts);
    }

    var balance = 0;
    for (const bout of bouts) {
        balance += betUnderdog(bout);
    }
    show("Underdog betting policy: " + balance);
}

document.addEventListener('DOMContentLoaded', function() {
    main();
}, false);
