import * as functions from "firebase-functions";
import blizzCred from './blizzCred';

import { BaseAffix, Dungeon, Member, Runs } from '../../guildstone-masters/src/types';

import * as admin from 'firebase-admin';
import axios from 'axios';
import { jacRaiderIo } from "./tests/axiosResponses";

admin.initializeApp();
const db = admin.firestore();

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

type RaiderIO = typeof jacRaiderIo

const getToken = async () => {
    const url = `https://${blizzCred.id}:${blizzCred.secret}@us.battle.net/oauth/token?grant_type=client_credentials`
    const tokenRes = await axios.post(url);
    return tokenRes.data.access_token;
}

const getGuildRoster = async (token:string, region:string, nameSlug:string, realmSlug:string) => {
    try{
        const locale = 'en_US';
        const guildURL = `https://${region}.api.blizzard.com/data/wow/guild/${realmSlug}/${nameSlug}/roster`
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

const getKSMProg = async (characterName:string, realmSlug:string, region:string, token:string):Promise<Runs> =>{
    const emptyRuns = {
        fortified:{
            'De Other Side': 0,
            'Halls of Atonement': 0,
            'Mists of Tirna Scithe': 0,
            'Plaguefall': 0,
            'The Necrotic Wake': 0,
            'Sanguine Depths': 0,
            'Spires of Ascension': 0,
            'Theater of Pain': 0
        },
        tyrannical:{
            'De Other Side': 0,
            'Halls of Atonement': 0,
            'Mists of Tirna Scithe': 0,
            'Plaguefall': 0,
            'The Necrotic Wake': 0,
            'Sanguine Depths': 0,
            'Spires of Ascension': 0,
            'Theater of Pain': 0
        }
    } as Runs
    try {
        const response = await axios.get(
            `https://raider.io/api/v1/characters/profile?region=${region}&realm=${realmSlug}&name=${characterName}&fields=mythic_plus_best_runs%2Cmythic_plus_alternate_runs`,
            {
                params:{
                    headers:{
                        accept: 'application/json'
                    }
                }
            }
        )
        const data = response.data as RaiderIO
        const bestAndAltRuns = data.mythic_plus_alternate_runs.concat(data.mythic_plus_best_runs)
        //TODO: Refactor this, it's ugly AF
        return bestAndAltRuns.reduce((runs, run) => {
            const baseAffix = run.affixes.find(
                affix => affix.id === 10 || affix.id === 9
            )
            if (!baseAffix) return runs
            const baseAffixName = baseAffix.name.toLowerCase() as BaseAffix
            const dungeonName = run.dungeon as Dungeon
            runs[baseAffixName][dungeonName] = run.score
            return runs
        }, emptyRuns);
    } catch (error) {
        console.error(error)
        //TODO: Probably shouldn't return this, but something else
        return emptyRuns
    }
}

const updateGuild = async (data:GuildData, context:functions.https.CallableContext) => {
    try{
        const token = await getToken();
        const roster = await getGuildRoster(token, 'us', 'french-toast', 'icecrown') as Member[];
        const guildPromises = roster?.map(async player=> {
            const prog = await getKSMProg(player.name.toLowerCase(), player.realm.toLowerCase(), 'us', token);
            player['best-runs'] = prog
            return player;
        })

        const filledRoster = await Promise.all(guildPromises);

        const ref = db.doc('/region/us/realms/icecrown/guilds/french-toast')

        await ref.set({
            roster: filledRoster
        }, {merge: true})

        return filledRoster;

    }catch(err){
        console.error(err)
        return undefined;
    }
}

export default updateGuild;