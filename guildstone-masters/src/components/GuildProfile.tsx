import { db } from '../firebase-init'

import { useEffect, useState, FunctionComponent } from 'react';
import { Guild, Member } from '../types';

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

    return <React.Fragment>
        <h1>{guild.name}</h1>
        <RosterView roster={guild.roster} />
        <UpdateButton 
            region={props.region} 
            realm={props.realm} 
            name={props.name}
            setter={updateGuild} 
        />
    </React.Fragment>
}

export default GuildProfile