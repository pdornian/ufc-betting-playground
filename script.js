function parseBoutStrings() {
    const output = [];

    // Format the raw input strings into something useful
    for(const boutString of boutStrings) {
        const i = boutString.split(",");
        const val = {
            nameA:i[0],
            heightA:parseFloat(i[56]),
            reachA:parseFloat(i[57]),
            weightA:parseFloat(i[58]),
            oddsA:parseFloat(i[2]),
            nameB:i[1],
            heightB:parseFloat(i[33]),
            reachB:parseFloat(i[34]),
            weightB:parseFloat(i[35]),
            oddsB:parseFloat(i[3]),
            winner:i[8] === "Red" ? i[0] : i[1],
        };
        if (isNaN(val.oddsA) || isNaN(val.oddsB) || isNaN(val.heightA) || isNaN(val.heightB) || isNaN(val.reachA) || isNaN(val.reachB) || isNaN(val.weightA) || isNaN(val.weightB)) {
            console.log("Ignore malformed bout:" + boutString);
        } else {
            output.push(val);
        }
    }
    return output;
}

function showTestResults(bouts) {
    const test = document.getElementById("results");
    console.log(test);
    const startIndex = 0;//Math.floor(Math.random() * boutStrings.length);
    for (var x = startIndex; x < boutStrings.length; x++) {
        const p = document.createElement("h3");
        const v = bouts[x];
        var text = "";
        text += "name:" + v.nameA + " weight:" + v.weightA + " height:" + v.heightA + " reach:" + v.reachA + " odds:" + v.oddsA;
        text += " VERSUS "
        text += "name:" + v.nameB + " weight:" + v.weightB + " height:" + v.heightB + " reach:" + v.reachB + " odds:" + v.oddsB;
        text += " WINNER:" + v.winner;
        p.textContent = text;
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

/**
 *
 * Uriah Hall 245.0 vs Paulo Costa -290 winner:Paulo Costa
 * Bet 290 on costa, get 290+100 back so +100
 *
 * Paul Felder -170.0 vs Mike Perry 150 winner:Mike Perry
 * Bet 170 on Felder, get 0 back so -170
 */
function betFavorite(bout) {
    if (bout.oddsA === bout.oddsB) {
        return 0;
    }

    // Win case: the favorite won so return 100
    if ((bout.oddsA < bout.oddsB && bout.winner === bout.nameA) || (bout.oddsB < bout.oddsA && bout.winner === bout.nameB)) {
        return 100;
    }

    // Lose case: lose the odds on the favorite
    return Math.min(bout.oddsA, bout.oddsB);
}

function betTaller(bout) {
    if (bout.heightA > bout.heightB) {
        return betA(bout);
    } else {
        return betB(bout);
    }
}

function betLongerReach(bout) {
    if (bout.reachA > bout.reachB) {
        return betA(bout);
    } else {
        return betB(bout);
    }
}

function betHeavier(bout) {
    if (bout.weightA > bout.weightB) {
        return betA(bout);
    } else {
        return betB(bout);
    }
}

function betLighter(bout) {
    if (bout.weightA > bout.weightB) {
        return betB(bout);
    } else {
        return betA(bout);
    }
}

function betA(bout) {
    // Win case
    if (bout.winner == bout.nameA) {
        if (bout.oddsA < bout.oddsB) {
            return 100;
        } else {
            return Math.max(bout.oddsA, bout.oddsB);
        }
    }

    // Lose case
    if (bout.oddsA < bout.oddsB) {
        return bout.oddsA;
    } else {
        return -100;
    }
}

function betB(bout) {
    // Win case
    if (bout.winner == bout.nameB) {
        if (bout.oddsB < bout.oddsA) {
            return 100;
        } else {
            return Math.max(bout.oddsA, bout.oddsB);
        }
    }

    // Lose case
    if (bout.oddsB < bout.oddsA) {
        return bout.oddsB;
    } else {
        return -100;
    }
}

function show(text) {
    const results = document.getElementById("results");
    const p = document.createElement("h3");
    p.textContent = "" + text;
    results.appendChild(p);
}

function main() {
    const bouts = parseBoutStrings();

    // showTestResults(bouts);

    var balance = 0.0;
    for (const bout of bouts) {
        balance += betUnderdog(bout);
    }
    show("Underdog betting policy: " + balance);

    balance = 0;
    for (const bout of bouts) {
        balance += betFavorite(bout);
    }
    show("Favorite betting policy: " + balance);

    balance = 0;
    for (const bout of bouts) {
        balance += betTaller(bout);
    }
    show("Taller betting policy: " + balance);

    balance = 0;
    for (const bout of bouts) {
        balance += betHeavier(bout);
    }
    show("Heavier betting policy: " + balance);

    balance = 0;
    for (const bout of bouts) {
        balance += betLighter(bout);
    }
    show("Lighter betting policy: " + balance);

    balance = 0;
    for (const bout of bouts) {
        balance += betLongerReach(bout);
    }
    show("Longer reach betting policy: " + balance);
}

document.addEventListener('DOMContentLoaded', function() {
    main();
}, false);
