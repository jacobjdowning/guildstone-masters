import { db } from '../firebase-init'

import { useEffect, useState, FunctionComponent } from 'react';
import { Guild, Member, BaseAffix, DungeonKey, Dungeon} from '../types';

import RosterView from './RosterView';
import React from 'react';
import UpdateButton from './UpdateButton';


interface Props{
    realm: string,
    name: string,
    region: string
}

const GuildProfile:FunctionComponent<Props> = (props) => {
    const [guild, setGuild] = useState<Guild | undefined>(undefined);
    const [baseAffix, setBaseAffix] = useState<BaseAffix>('fortified');
    const [dungeon, setDungeon] = useState<Dungeon>('De Other Side');
    const [keyLevel, setKeyLevel] = useState<number>(0);
    const [key, setKey] = useState<DungeonKey>();

    function updateGuild (newRoster:Member[]){
        console.log('update called')
        if (guild){
            setGuild({
                name: guild.name,
                realm: guild.realm,
                roster: newRoster
            })
        }
    }

    //TODO: Clear dungeon key when toggled -> reduces confusion
    function toggleBaseAffix(){
        if (baseAffix === 'fortified'){
            setBaseAffix('tyrannical');
            return;
        }
        setBaseAffix('fortified');
    }

    useEffect(()=>{
        const fetchGuild = async () => {
            const ref = db.collection('region').doc(props.region)
                .collection('realms').doc(props.realm)
                .collection('guilds').doc(props.name)

            const guildSnap = await ref.get()
            const guildData:Guild = await guildSnap.data() as Guild;
            setGuild(guildData);
        }
        fetchGuild();
    }, [props])

    if (!guild){
        return <span>Loading</span>
    }

    function dungeonChange(event:React.ChangeEvent<HTMLSelectElement>) {
        setDungeon(event.target.value as Dungeon);
    }

    function levelChange(event:React.ChangeEvent<HTMLInputElement>){
        const input = parseInt(event.target.value);
        setKeyLevel(input>=0?input:0);
    }

    function confirmKey(event:React.MouseEvent<HTMLInputElement>){
        setKey({
            dungeon:dungeon,
            level:keyLevel,
            baseAffix:baseAffix
        })
    }

    return <React.Fragment>
        <h1>{guild.name}</h1>
        <div>
            <label>My Key</label>
            <select name="dungeon" id="dungeon" value={dungeon} onChange={dungeonChange}>
                <option>De Other Side</option>
                <option>Halls of Atonement</option>
                <option>Mists of Tirna Scithe</option>
                <option>The Necrotic Wake</option>
                <option>Plaguefall</option>
                <option>Sanguine Depths</option>
                <option>Spires of Ascension</option>
                <option>Theater of Pain</option>
            </select>
            <input type="number" name="keylevel" id="keylevel" value={keyLevel} onChange={levelChange}/>
            <input type="button" value="Analyze" onClick={confirmKey}/>
            <label className="toggle">
                <input 
                    checked={baseAffix !== 'fortified'} 
                    type="checkbox" 
                    onChange={toggleBaseAffix}
                />
                <div></div>
            </label>
        </div>
        <RosterView roster={guild.roster} baseAffix={baseAffix} dungeonKey={key} />
        <UpdateButton 
            region={props.region} 
            realm={props.realm} 
            name={props.name}
            setter={updateGuild}
        />
    </React.Fragment>
}

export default GuildProfile