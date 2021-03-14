const admin = require('firebase-admin')

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://guildstone-masters.firebaseio.com'
});

const blizzCred = require('./blizzCred');

const axios = require('axios');

const db = admin.firestore();

const getToken = async () => {
    const url = `https://${blizzCred.id}:${blizzCred.secret}@us.battle.net/oauth/token?grant_type=client_credentials`
    const tokenRes = await axios.post(url);
    return tokenRes.data.access_token;
}

const getGuildRoster = async (token) => {
    try{
        const region = 'us';
        const locale = 'en_US';
        const nameSlug = 'french-toast';
        const realmSlug = 'icecrown';
        const guildURL =   `https://${region}.api.blizzard.com/data/wow/guild/${realmSlug}/${nameSlug}/roster`
        const guildRes = await axios.get(guildURL, {params:{
                locale: locale,
                namespace: `profile-${region}`,
                access_token: token
            },
            timeout: 60000
        })
        
        const sixties = guildRes.data.members.filter( member => member.character.level === 60)
        return sixties.map(member => {
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

const getKSMProg = async (characterName, realmSlug, region, token) =>{
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
        const onlyTimed = res.data.best_runs.filter(run => run.is_completed_within_time)
        return onlyTimed.reduce((prog, run) => {
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

const main = async () => {
    try{
        const token = await getToken();
        const roster = await getGuildRoster(token);
        const guildPromises = roster.map(async player => {
            const prog = await getKSMProg(player.name, player.realm, 'us', token);
            player ['progress'] = prog
            return player;
        })
        const guild = await Promise.all(guildPromises);
        
        const ref = db.doc('/region/us/realms/icecrown/guilds/french-toast');

        await ref.set({
            roster: guild
        }, {merge:true})

        console.log("Done!")
    }catch(err){
        console.error(err);
    }
}

main();