import { Member, Dungeon, BaseAffix, DungeonKey, AchievementNames } from '../types';

import '../styles/styles.css'
import classColorsClass from '../styles/classColors.module.css'
import { useState, FunctionComponent, useEffect, useCallback } from 'react';
import { getRatingforLevel } from '../logic/ratingLogic';

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
    
    function potentialForMemberAndKey(member:Member, dKey:DungeonKey | undefined):AchievementNames | undefined{
        if (!dKey) {return};
        const lastScore = member['best-runs'][baseAffix][dKey.dungeon];
        const potentialScore = getRatingforLevel(dKey.level); 
        const scoreDelta = potentialScore - lastScore;

        const achievements:Record<AchievementNames, number> = {
            explorer:750,
            conqueror:1500,
            master:2000
        }

        if (scoreDelta <= 0){
            return;
        }

        for (const chieve in achievements) {
            if (Object.prototype.hasOwnProperty.call(achievements, chieve)) {
                const castChieve = chieve as AchievementNames
                const score:number = achievements[castChieve];
                if (member.rating){
                    if (member.rating <= score && member.rating + scoreDelta > score){
                        console.log(`Adding potential ${castChieve} to ${member.name}`)
                        return castChieve;
                    }
                }
            }
        }
    }

    const addRatingTotal = (members:Member[]) => {
        return members.map( member => {
            const baseAffix:BaseAffix[] = ['fortified', 'tyrannical']

            const affRating = (affix:BaseAffix) => Object.values(member['best-runs'][affix]).reduce(
                (total, rating) =>  total + rating
            , 0);

            member.rating = baseAffix.reduce(
                (total, cur) => affRating(cur) + total
            , 0);

            return member
        })
    }

    const baseSort = (a:Member, b:Member) => {
        if (a.rating && b.rating){
            return b.rating-a.rating
        }else if(!a.rating){
            return 1
        }else{
            return -1
        }
    }

    const [members, setMembers] = useState(() => addRatingTotal(roster).sort(baseSort))

    const ratingMemoized = useCallback(addRatingTotal, []);

    useEffect(() => {
        setMembers(addRatingTotal(roster).sort(baseSort));
    }, [roster, ratingMemoized])

    return <table>
        <thead>
            <tr>
                <th></th>
                <th onClick={() => setMembers(prev=>[...prev.sort(baseSort)])}> Rating </th>
                {dungeons.map((dungeon, i) => 
                    <th 
                        key={i}
                    >
                        {dungeon}
                    </th>)
                }    
            </tr>
        </thead>
        <tbody>
            {members.map((member, j) =>
                <tr key={j}>
                    <th className={classColors[member.class]}>{member.name} {potentialForMemberAndKey(member, dungeonKey)}</th>
                    <td>
                        {member.rating}
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