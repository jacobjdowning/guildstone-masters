import * as functions from "firebase-functions";
import blizzCred from './blizzCred';

import * as admin from 'firebase-admin';
import axios from 'axios';

admin.initializeApp();
const db = admin.firestore();

//TODO consolidate types with client

type GuildData = {
    region: string,
    realm: string,
    name: string
}

type GuildMember = {
    character : {
        level: number,
        name: string,
        realm: {
            slug: string
        },
        playable_class: {
            id: number
        }
    }
}

interface Member {
    class: number,
    name: string,
    realm: string,
    progress?:{
        'Mists of Tirna Scithe': number,
        'Sanguine Depths': number,
        'De Other Side': number,
        'The Necrotic Wake': number,
        'Theater of Pain': number,
        'Spires of Ascension': number,
        'Halls of Atonement': number,
        'Plaguefall': number
    },
    progressTotal?: number
}


// const toQueryParams = (dict:Record<string, string>) => {
//     Object.keys(dict).reduce((output, key) => 
//         `${output}${key}=${dict[key]}&`
//     , '?')
// }

const getToken = async () => {
    const url = `https://${blizzCred.id}:${blizzCred.secret}@us.battle.net/oauth/token?grant_type=client_credentials`
    const tokenRes = await axios.post(url);
    return tokenRes.data.access_token;
}

const getGuildRoster = async (token:string, region:string, nameSlug:string, realmSlug:string) => {
    try{
        const locale = 'en_US';
        const guildURL =   `https://${region}.api.blizzard.com/data/wow/guild/${realmSlug}/${nameSlug}/roster`
        const guildRes = await axios.get(guildURL, {params:{
                locale: locale,
                namespace: `profile-${region}`,
                access_token: token
            },
            timeout: 60000
        })
        
        const sixties = guildRes.data.members.filter( (member:GuildMember) => member.character.level === 60)
        return sixties.map((member:GuildMember) => {
            return {
                name: member.character.name,
                realm: member.character.realm.slug,
                class: member.character.playable_class.id
            }
        })
    }catch(error){
        console.error(error)
    }

}

const getKSMProg = async (characterName:string, realmSlug:string, region:string, token:string) =>{
    const seasonId = 5
    const locale = 'en_US'
    const profileURL = `https://${region}.api.blizzard.com/profile/wow/character/${realmSlug}/${characterName.toLowerCase()}/mythic-keystone-profile/season/${seasonId}`
    const blankProg = {
        'Mists of Tirna Scithe': 0,
        'Sanguine Depths': 0,
        'De Other Side': 0,
        'The Necrotic Wake': 0,
        'Theater of Pain': 0,
        'Spires of Ascension': 0,
        'Halls of Atonement': 0,
        'Plaguefall': 0
    }
    try{
        const res = await axios.get(profileURL, {params:{
                locale: locale,
                namespace: `profile-${region}`,
                access_token: token
            },
            timeout: 60000
        })

        //TODO FIX TYPES
        const onlyTimed = res.data.best_runs.filter((run:any) => run.is_completed_within_time)
        return onlyTimed.reduce((prog:any, run:any) => {
            prog[run.dungeon.name] = run.keystone_level;
            return prog;
        }, blankProg)

    }catch(err){
        if (err.response.status == 404){
            return blankProg;
        }
        console.error(err);
    }
}

const updateGuild = async (data:GuildData, context:functions.https.CallableContext) => {
    console.log(`updating guild ${data.name}`);
    try{
        const token = await getToken();
        const roster = await getGuildRoster(token, 'us', 'french-toast', 'icecrown') as Member[];
        const guildPromises = roster?.map(async player=> {
            const prog = await getKSMProg(player.name, player.realm, 'us', token);
            player['progress'] = prog
            return player;
        })

        const guild = await Promise.all(guildPromises);

        const ref = db.doc('/region/us/realms/icecrown/guilds/french-toast')

        await ref.set({
            roster: guild
        }, {merge: true})

        return guild;

    }catch(err){
        console.error(err)
        return undefined;
    }
}

export default updateGuild;