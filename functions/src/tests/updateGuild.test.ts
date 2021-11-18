import axios from 'axios'
import blizzCred from '../blizzCred'
import { blizzGuild, jacRaiderIo, tokenResponse } from './axiosResponses'

import * as admin from 'firebase-admin';

jest.mock('axios');
const mockedPost = (axios.post as jest.Mock)
const mockedGet = (axios.get as jest.Mock)

const tester = require('firebase-functions-test')();
const index = require('../index');
const wrapped = tester.wrap(index.updateGuild);

const db = admin.firestore();


async function deleteInCollection(collection:string) {
    const snapshot = await db.collection('region').get()
    const batch = db.batch()
    snapshot.docs.forEach(async doc => {
        batch.delete(doc.ref)
    })
    await batch.commit()
}

describe('Around UpdateGuild HTTP function', () => {
    beforeEach(async ()=>{
        //Mocking Axios
        mockedPost.mockResolvedValue({data: tokenResponse})
        mockedGet.mockImplementation((urlString:string, options={}) => {
            if (urlString.includes('api.blizzard.com/data/wow/guild') && urlString.includes('roster'))
                return Promise.resolve({data: blizzGuild})
            if (urlString.includes('https://raider.io/api/v1/characters/profile?'))
                return Promise.resolve({data: jacRaiderIo})
            console.log("unsupported url : ", urlString)
            return Promise.resolve('unsupported url in testing');
        })

        //Setup DB
        const dbSetupPromises = []
        dbSetupPromises.push( db.doc('/region/us/realms/icecrown/guilds/french-toast').set({
            name: "French Toast",
            realm: "icecrown",
            roster: [],
            lastUpdate: 0
        }) )
        
        await Promise.all(dbSetupPromises)

    })
    test('Should gather a token from blizzard', async ()=> {
        await wrapped({
            region: 'us',
            realm: 'icecrown',
            name:'french-toast'
        })
        expect(mockedPost).toHaveBeenCalledWith(`https://${blizzCred.id}:${blizzCred.secret}@us.battle.net/oauth/token?grant_type=client_credentials`);
    })
    test('Should collect guild roster from blizzard', async () => {
        const onCallData = {
            region: 'us',
            realm: 'icecrown',
            name: 'french-toast'
        } 
        await wrapped(onCallData)
        expect(mockedGet).toHaveBeenCalledWith(
            `https://${onCallData.region}.api.blizzard.com/data/wow/guild/${onCallData.realm}/${onCallData.name}/roster`,
            {
                params:{
                    locale: 'en_US',
                    namespace: `profile-${onCallData.region}`,
                    access_token: tokenResponse.access_token
                },
                timeout: 60000
            }
        );
    })
    test('Should collect individual player data from Raider.io', async () => {
        const onCallData={
            region: 'us',
            realm: 'icecrown',
            name: 'french-toast'
        }
        await wrapped(onCallData)
        expect(mockedGet).toHaveBeenCalledTimes(92)
        expect(mockedGet).toHaveBeenCalledWith(
            'https://raider.io/api/v1/characters/profile?region=us&realm=malygos&name=oberhasli&fields=mythic_plus_best_runs%2Cmythic_plus_alternate_runs',
            {
                params:{
                    headers:{
                        accept: 'application/json'
                    }
                }
            }
        )
    })
    test('Jacatola, Baggins, and Locumire should all be represented in the '+
    'guild roster and have the same and correct \"best runs\"',async () => {
        const onCallData={
            region: 'us',
            realm: 'icecrown',
            name: 'french-toast'
        }
        const mockedBestRuns = {
            fortified:{
                'De Other Side': 144.3,
                'Halls of Atonement': 150.6,
                'Mists of Tirna Scithe': 145.6,
                'Plaguefall': 131.6,
                'The Necrotic Wake': 155.8,
                'Sanguine Depths': 117.7,
                'Spires of Ascension': 135.6,
                'Theater of Pain': 131
            },
            tyrannical:{
                'De Other Side': 131.7,
                'Halls of Atonement': 136,
                'Mists of Tirna Scithe': 133.7,
                'Plaguefall': 151.2,
                'The Necrotic Wake': 132.3,
                'Sanguine Depths': 130.2,
                'Spires of Ascension':151.1,
                'Theater of Pain': 126.7
            }
        }
        await wrapped(onCallData)
        
        const snap = await db.doc('/region/us/realms/icecrown/guilds/french-toast').get()
        const roster = snap.data()?.roster

        expect(roster).toContainEqual({
            class: 4,
            name: 'Jacatola',
            realm: 'icecrown',
            'best-runs': mockedBestRuns
        })
        expect(roster).toContainEqual({
            class: 10,
            name: 'Baggins',
            realm: 'icecrown',
            'best-runs': mockedBestRuns
        })
        expect(roster).toContainEqual({
            class: 8,
            name: 'Locumire',
            realm: 'icecrown',
            'best-runs': mockedBestRuns
        })

    })
    test('Two update requests to the same guild within 10 minutes ' +
    'should only hit the APIs once', async () => {
        const onCallData={
            region: 'us',
            realm: 'icecrown',
            name: 'french-toast'
        }
        await wrapped(onCallData)
        await wrapped(onCallData)

        expect(mockedGet).toBeCalledTimes(92)
    })
    afterEach(async ()=>{
        mockedPost.mockReset()
        mockedGet.mockReset()

        const teardownPromises = []
        teardownPromises.push(deleteInCollection('region'))
        await Promise.all(teardownPromises)
    })
})