import { getRatingforLevel, calcTotalRating, ratingBumpFromKey } from '../logic/ratingLogic';
import { DungeonKey, Runs } from '../types';

describe('Logic around calculating rating', () => {
    test('getRatingforLevel follows precalculated values from RaiderIO', () => {       
        const riovalues = [40,45,55,60,65,75,80,85,100,105,110,115,120,125,130,135,140,145,150,155,160,165,170,175,180,185,190,195,200]
        riovalues.forEach((value, i) => {
            expect(getRatingforLevel(i+2)).toBe(value)
        })
    })
    test('calcTotalRating should return a 0 if no dungeons have been completed', () => {
        const zeroDungeonRuns:Runs = {
            fortified:{
                'De Other Side': 0,
                'Halls of Atonement': 0,
                'Mists of Tirna Scithe': 0,
                'Plaguefall': 0,
                'The Necrotic Wake': 0,
                'Sanguine Depths': 0,
                'Spires of Ascension': 0,
                'Theater of Pain': 0,
            },
            tyrannical:{
                'De Other Side': 0,
                'Halls of Atonement': 0,
                'Mists of Tirna Scithe': 0,
                'Plaguefall': 0,
                'The Necrotic Wake': 0,
                'Sanguine Depths': 0,
                'Spires of Ascension': 0,
                'Theater of Pain': 0,
            }
        }
        expect(calcTotalRating(zeroDungeonRuns)).toEqual(0);      
    })
    test('calcTotalRating of Banjo\'s case returns his correct rating', () => {
        const banjosRuns:Runs = {
            fortified:{
                'De Other Side': 132.9,
                'Halls of Atonement': 136.2,
                'Mists of Tirna Scithe': 140.9,
                'Plaguefall': 137.2,
                'The Necrotic Wake': 146.7,
                'Sanguine Depths': 136.6,
                'Spires of Ascension': 135.6,
                'Theater of Pain': 135.8,
            },
            tyrannical:{
                'De Other Side': 131.4,
                'Halls of Atonement': 136,
                'Mists of Tirna Scithe': 135.4,
                'Plaguefall': 137.4,
                'The Necrotic Wake': 137.6,
                'Sanguine Depths': 136.7,
                'Spires of Ascension': 135.9,
                'Theater of Pain': 126.4,
            }
        }
        expect(calcTotalRating(banjosRuns)).toEqual(2192)
    })
    test('calcTotalRating of all 15s should return exactly 2000 rating', ()=> {
        const allFifteens = {
            'De Other Side': getRatingforLevel(15),
            'Halls of Atonement': getRatingforLevel(15),
            'Mists of Tirna Scithe': getRatingforLevel(15),
            'Plaguefall': getRatingforLevel(15),
            'The Necrotic Wake': getRatingforLevel(15),
            'Sanguine Depths': getRatingforLevel(15),
            'Spires of Ascension': getRatingforLevel(15),
            'Theater of Pain': getRatingforLevel(15),
        }
        const fullFifteenRuns = {
            fortified: allFifteens,
            tyrannical: allFifteens
        }

        expect(calcTotalRating(fullFifteenRuns)).toEqual(2000)
    })
    test('ratingBumpFromKey for a player that has no saved mythic + runs ' +
    'should be exactly 1.5 * the getRatingforLevel of that key', () => {
        
        const zeroDungeonRuns:Runs = {
            fortified:{
                'De Other Side': 0,
                'Halls of Atonement': 0,
                'Mists of Tirna Scithe': 0,
                'Plaguefall': 0,
                'The Necrotic Wake': 0,
                'Sanguine Depths': 0,
                'Spires of Ascension': 0,
                'Theater of Pain': 0,
            },
            tyrannical:{
                'De Other Side': 0,
                'Halls of Atonement': 0,
                'Mists of Tirna Scithe': 0,
                'Plaguefall': 0,
                'The Necrotic Wake': 0,
                'Sanguine Depths': 0,
                'Spires of Ascension': 0,
                'Theater of Pain': 0,
            }
        }

        const key:DungeonKey = {
            dungeon: 'Plaguefall',
            level: 15,
            baseAffix: 'fortified'
        }
        expect(ratingBumpFromKey(zeroDungeonRuns, key)).toEqual(getRatingforLevel(15)*1.5)
    })
    test('ratingBumpFromKey for a player who had a score of 80 and a key of 14'+
    'of that same dungeon would have a bump of 140', ()=> {
        const oneEighty:Runs = {
            fortified:{
                'De Other Side': 0,
                'Halls of Atonement': 0,
                'Mists of Tirna Scithe': 0,
                'Plaguefall': 80,
                'The Necrotic Wake': 0,
                'Sanguine Depths': 0,
                'Spires of Ascension': 0,
                'Theater of Pain': 0,
            },
            tyrannical:{
                'De Other Side': 0,
                'Halls of Atonement': 0,
                'Mists of Tirna Scithe': 0,
                'Plaguefall': 0,
                'The Necrotic Wake': 0,
                'Sanguine Depths': 0,
                'Spires of Ascension': 0,
                'Theater of Pain': 0,
            }
        }
        
        const key:DungeonKey = {
            dungeon: 'Plaguefall',
            level: 14,
            baseAffix: 'fortified'
        }
        expect(ratingBumpFromKey(oneEighty, key)).toEqual(100)
    })
})