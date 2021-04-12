import { Member } from '../types';

import '../styles/styles.css'
import classColorsClass from '../styles/classColors.module.css'
import { useState, FunctionComponent, useEffect, useCallback } from 'react';

type Dungeon = 'De Other Side'|
'Halls of Atonement'|
'Mists of Tirna Scithe'|
'Plaguefall'|
'The Necrotic Wake'|
'Sanguine Depths'|
'Spires of Ascension'|
'Theater of Pain'

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
    roster: Member[]
}

const RosterView:FunctionComponent<RosterViewProps> = ({roster}) => {
    
    const addProgTotal = (members:Member[]) => {
        return members.map( member => {
            const progressTotal = Object.values(member.progress).reduce(
                (total, highest) =>  total + ((highest>14)?1:0)
            , 0)
    
            member.progressTotal = progressTotal;
            return member
        })
    }

    const progMemoized = useCallback(addProgTotal, []);

    const filterFinished = (member:Member) => {
        if (member.progressTotal !== undefined){
            return member.progressTotal < 8
        }
        return false
    }

    const sorterFor = (dungeon:Dungeon) => (a:Member, b:Member) => {
        const aDone = a.progress[dungeon] >= 15
        const bDone = b.progress[dungeon] >= 15
        if ((aDone && bDone) || !(aDone || bDone)){
            return 0
        }
        return a.progress[dungeon] - b.progress[dungeon];
    }

    const baseSort = (a:Member, b:Member) => {
        if (a.progressTotal && b.progressTotal){
            return b.progressTotal-a.progressTotal
        }else if(!a.progressTotal){
            return 1
        }else{
            return -1
        }
    }

    const [members, setMembers] = useState(() => addProgTotal(roster).filter(filterFinished).sort(baseSort))

    useEffect(() => {
        setMembers(addProgTotal(roster).filter(filterFinished).sort(baseSort));
    }, [roster, progMemoized])

    return <table>
        <thead>
            <tr>
                <th></th>
                <th onClick={() => setMembers(prev=>[...prev.sort(baseSort)])}> Progress </th>
                {dungeons.map((dungeon, i) => 
                    <th 
                        key={i}
                        onClick={()=>setMembers(
                            prev=>[...prev.sort(baseSort).sort(sorterFor(dungeon))]
                        )}
                    >
                        {dungeon}
                    </th>)
                }    
            </tr>
        </thead>
        <tbody>
            {members.map((member, j) =>
                <tr key={j}>
                    <th className={classColors[member.class]}>{member.name}</th>
                    <td>
                        {
                            Object.values(member.progress)
                                .reduce((total, highest) =>  total + ((highest>14)?1:0), 0)
                        }/8
                    </td>
                    {dungeons.map((dungeon, i) => 
                        <td key={i}>
                            {member.progress[dungeon]}
                        </td>
                    )}
                </tr>
            )}
        </tbody>
    </table>
}

export default RosterView;