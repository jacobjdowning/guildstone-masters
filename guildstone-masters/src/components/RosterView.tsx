import { Member, Dungeon, BaseAffix, DungeonKey, Runs } from '../types';

import '../styles/styles.css'
import classColorsClass from '../styles/classColors.module.css'
import { FunctionComponent } from 'react';
import { achievementFromKey, calcTotalRating, ratingBumpFromKey } from '../logic/ratingLogic';

const dungeons:Dungeon[] = [
    'De Other Side',
    'Halls of Atonement',
    'Mists of Tirna Scithe',
    'Plaguefall',
    'The Necrotic Wake',
    'Sanguine Depths',
    'Spires of Ascension',
    'Theater of Pain',
]

const classColors = [
    '',
    classColorsClass.warrior,
    classColorsClass.paladin,
    classColorsClass.hunter,
    classColorsClass.rogue,
    classColorsClass.priest,
    classColorsClass['death-knight'],
    classColorsClass.shaman,
    classColorsClass.mage,
    classColorsClass.warlock,
    classColorsClass.monk,
    classColorsClass.druid,
    classColorsClass['demon-hunter']
]

type RosterViewProps = {
    roster: Member[],
    baseAffix: BaseAffix,
    dungeonKey?: DungeonKey
}

const RosterView:FunctionComponent<RosterViewProps> = ({roster, baseAffix, dungeonKey}) => {
    const sortedRoster = [...roster];

    function byTotalRating(a:Member, b:Member){
        return calcTotalRating(b['best-runs']) - calcTotalRating(a['best-runs'])
    }

    function byRatingBump(a:Member, b:Member, key:DungeonKey|undefined){
        if (!key) return 0
        return ratingBumpFromKey(b['best-runs'], key) - ratingBumpFromKey(a['best-runs'], key)
    }
    
    function byAchievementEarnedFromKey(a:Member, b:Member, key:DungeonKey|undefined){
        if (!key) return 0
        const achievementValue = {
            explorer: 1,
            conqueror: 2,
            master: 3,
            none: 0
        }
        const compareValue = {
            a: achievementValue[achievementFromKey(a['best-runs'], key) || 'none'],
            b: achievementValue[achievementFromKey(b['best-runs'], key) || 'none']
        } 
        return compareValue.b - compareValue.a
    }

    function getAchievementClass(runs:Runs, key:DungeonKey|undefined) {
        if (!key) return ''
        return `${achievementFromKey(runs, key)}-achieved`
    }

    sortedRoster.sort((a, b) =>
        byAchievementEarnedFromKey(a,b,dungeonKey) ||
        byRatingBump(a,b,dungeonKey) || 
        byTotalRating(a,b)
    );
    
    return <table>
        <thead>
            <tr>
                <th></th>
                <th onClick={() =>{} }> Rating </th>
                {dungeons.map((dungeon, i) => 
                    <th key={i} >
                        {dungeon}
                    </th>)
                }    
            </tr>
        </thead>
        <tbody>
            {sortedRoster.map((member, j) =>
                <tr key={j} className={getAchievementClass(member['best-runs'], dungeonKey)}>
                    <th className={classColors[member.class]}>{member.name}</th>
                    <td>
                        {calcTotalRating(member['best-runs'])}
                    </td>
                    {dungeons.map((dungeon, i) => 
                        <td key={i}>
                            {member['best-runs'][baseAffix][dungeon]}
                        </td>
                    )}
                </tr>
            )}
        </tbody>
    </table>
}

export default RosterView;