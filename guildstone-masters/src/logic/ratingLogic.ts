import { BaseAffix, Dungeon, DungeonKey, Runs } from "../types";

export function getRatingforLevel(keyLevel:number){
    let rating = 30;
    // rating for base level
    rating = rating + 5 * keyLevel
    // rating for affixes
    if (keyLevel >= 4){
        rating = rating + 5
    }
    if (keyLevel >= 7){
        rating = rating + 5
    }
    if (keyLevel >= 10){
        rating = rating + 10
    }
    return rating;
}

function compositeScore(scoreA:number, scoreB:number){
    return Math.max(scoreA, scoreB) + (scoreA + scoreB)/2
}

export function calcTotalRating(runs:Runs){
    const dungeons:Dungeon[] = [ 'De Other Side',
    'Halls of Atonement',
    'Mists of Tirna Scithe',
    'Plaguefall',
    'The Necrotic Wake',
    'Sanguine Depths',
    'Spires of Ascension',
    'Theater of Pain' ]

    const score = dungeons.reduce((score, dungeon)=> {
        const fortified = runs.fortified[dungeon];
        const tyrannical = runs.tyrannical[dungeon];
        return compositeScore(fortified,tyrannical) + score
    }, 0);
    return Math.round(score);
}

function withoutSmallest(array:number[]){
    const arrayClone = [...array]
    const indexOfMin = array.indexOf(Math.min(...array))
    arrayClone.splice(indexOfMin, 1);
    return arrayClone;
}

export function ratingBumpFromKey(runs:Runs, key:DungeonKey){
    const potentialKeys = [runs.fortified[key.dungeon], runs.tyrannical[key.dungeon], getRatingforLevel(key.level)]
    const topTwo = withoutSmallest(potentialKeys);
    const lastScore = compositeScore(runs.fortified[key.dungeon], runs.tyrannical[key.dungeon]);
    const newScore = compositeScore(topTwo[0], topTwo[1]);
    
    return newScore - lastScore;
}