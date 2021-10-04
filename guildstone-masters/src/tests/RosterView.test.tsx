import React from 'react';
import { shallow } from 'enzyme';

import RosterView from '../components/RosterView';
import { DungeonKey, Member } from '../types';
import { findRowFromName } from './testingUtils';

describe('Tests around the sorting table UI elelemnt', () => {

    test('RosterView renders at least one row from a roster of one', () =>{
        
        const roster:Member[] = [
            {
                class:0,
                name:'jacatola',
                realm: 'icecrown',
                'best-runs':{
                    fortified:{
                        'De Other Side': 100,
                        'Halls of Atonement': 100,
                        'Mists of Tirna Scithe': 100,
                        'Plaguefall': 100,
                        'The Necrotic Wake': 100,
                        'Sanguine Depths': 100,
                        'Spires of Ascension': 100,
                        'Theater of Pain': 100,
                    },
                    tyrannical:{
                        'De Other Side': 100,
                        'Halls of Atonement': 100,
                        'Mists of Tirna Scithe': 100,
                        'Plaguefall': 100,
                        'The Necrotic Wake': 100,
                        'Sanguine Depths': 100,
                        'Spires of Ascension': 100,
                        'Theater of Pain': 100,
                    }
                },
            }
        ]
        
        const wrapper = shallow(<RosterView roster={roster} baseAffix='fortified'/>)
        expect(wrapper.find('tbody').exists()).toBeTruthy();
        
    })

    test('Without a key added and nothing clicked the higest total rating should be at the top', () => {
        //Baggins rating > Phyto's rating > Jac's rating
        const roster:Member[] = [
            {
                class:0,
                name:'jacatola',
                realm: 'icecrown',
                'best-runs':{
                    fortified:{
                        'De Other Side': 100,
                        'Halls of Atonement': 100,
                        'Mists of Tirna Scithe': 100,
                        'Plaguefall': 100,
                        'The Necrotic Wake': 100,
                        'Sanguine Depths': 100,
                        'Spires of Ascension': 100,
                        'Theater of Pain': 100,
                    },
                    tyrannical:{
                        'De Other Side': 100,
                        'Halls of Atonement': 100,
                        'Mists of Tirna Scithe': 100,
                        'Plaguefall': 100,
                        'The Necrotic Wake': 100,
                        'Sanguine Depths': 100,
                        'Spires of Ascension': 100,
                        'Theater of Pain': 100,
                    }
                },
            },
            {
                class:1,
                name:'baggins',
                realm: 'icecrown',
                'best-runs':{
                    fortified:{
                        'De Other Side': 120,
                        'Halls of Atonement': 120,
                        'Mists of Tirna Scithe': 120,
                        'Plaguefall': 120,
                        'The Necrotic Wake': 120,
                        'Sanguine Depths': 120,
                        'Spires of Ascension': 120,
                        'Theater of Pain': 120,
                    },
                    tyrannical:{
                        'De Other Side': 120,
                        'Halls of Atonement': 120,
                        'Mists of Tirna Scithe': 120,
                        'Plaguefall': 120,
                        'The Necrotic Wake': 120,
                        'Sanguine Depths': 120,
                        'Spires of Ascension': 120,
                        'Theater of Pain': 120,
                    }
                }
            },
            {
                class:1,
                name:'phytotron',
                realm: 'icecrown',
                'best-runs':{
                    fortified:{
                        'De Other Side': 110,
                        'Halls of Atonement': 120,
                        'Mists of Tirna Scithe': 120,
                        'Plaguefall': 120,
                        'The Necrotic Wake': 120,
                        'Sanguine Depths': 120,
                        'Spires of Ascension': 120,
                        'Theater of Pain': 120,
                    },
                    tyrannical:{
                        'De Other Side': 120,
                        'Halls of Atonement': 120,
                        'Mists of Tirna Scithe': 120,
                        'Plaguefall': 110,
                        'The Necrotic Wake': 120,
                        'Sanguine Depths': 120,
                        'Spires of Ascension': 120,
                        'Theater of Pain': 120,
                    }
                }
            },
        ]
        
        const wrapper = shallow(<RosterView roster={roster} baseAffix='fortified' />)
        const tablebody = wrapper.find('tbody');
        const characterNames = tablebody.children().reduce((list:string[], tr)=>{
            const characterName = tr.find('th').text()
            list.push(characterName);
            return list 
        }, [])
        
        expect(characterNames).toEqual(['baggins', 'phytotron', 'jacatola'])
    })

    test('When a key is added and timing it would result in some members getting'+
    ' achievements, those members should be ordered first in the list and be given'+
    ' a special class', () => {
        const key:DungeonKey = {
            dungeon:"De Other Side",
            level: 10,
            baseAffix: "fortified"
        }
        //Jacatola - almost KSM
        //Ober - Almost Exlporer
        //Rex - Almost Conqueror
        //Rogueet - No gain but under KSM
        //Baggins - Already has KSM
        //Gwen - Under KSM over Conqueror, will gain io but not enough for KSM\
        //Newbie - No Score
        const roster:Member[] = [
            {
                class:1,
                name: "Jacatola",
                realm: "icecrown",
                "best-runs": {
                    fortified:{
                        'De Other Side': 0,
                        'Halls of Atonement': 125,
                        'Mists of Tirna Scithe': 125,
                        'Plaguefall': 125,
                        'The Necrotic Wake': 125,
                        'Sanguine Depths': 125,
                        'Spires of Ascension': 125,
                        'Theater of Pain': 125,
                    },
                    tyrannical:{
                        'De Other Side': 135,
                        'Halls of Atonement': 125,
                        'Mists of Tirna Scithe': 125,
                        'Plaguefall': 125,
                        'The Necrotic Wake': 125,
                        'Sanguine Depths': 125,
                        'Spires of Ascension': 125,
                        'Theater of Pain': 125,
                    }
                }
            },
            {
                class:1,
                name: "Ober",
                realm: "icecrown",
                "best-runs": {
                    fortified:{
                        'De Other Side': 0,
                        'Halls of Atonement': 45,
                        'Mists of Tirna Scithe': 45,
                        'Plaguefall': 45,
                        'The Necrotic Wake': 45,
                        'Sanguine Depths': 45,
                        'Spires of Ascension': 45,
                        'Theater of Pain': 45,
                    },
                    tyrannical:{
                        'De Other Side': 45,
                        'Halls of Atonement': 45,
                        'Mists of Tirna Scithe': 45,
                        'Plaguefall': 45,
                        'The Necrotic Wake': 45,
                        'Sanguine Depths': 45,
                        'Spires of Ascension': 45,
                        'Theater of Pain': 45,
                    }
                }
            },
            {
                class:1,
                name: "Rex",
                realm: "icecrown",
                "best-runs": {
                    fortified:{
                        'De Other Side': 0,
                        'Halls of Atonement': 100,
                        'Mists of Tirna Scithe': 100,
                        'Plaguefall': 100,
                        'The Necrotic Wake': 100,
                        'Sanguine Depths': 100,
                        'Spires of Ascension': 100,
                        'Theater of Pain': 50,
                    },
                    tyrannical:{
                        'De Other Side': 100,
                        'Halls of Atonement': 100,
                        'Mists of Tirna Scithe': 100,
                        'Plaguefall': 100,
                        'The Necrotic Wake': 100,
                        'Sanguine Depths': 100,
                        'Spires of Ascension': 100,
                        'Theater of Pain': 50,
                    }
                }
            },
            {
                class:1,
                name: "Rogueet",
                realm: "icecrown",
                "best-runs": {
                    fortified:{
                        'De Other Side': 101,
                        'Halls of Atonement': 45,
                        'Mists of Tirna Scithe': 45,
                        'Plaguefall': 45,
                        'The Necrotic Wake': 45,
                        'Sanguine Depths': 45,
                        'Spires of Ascension': 45,
                        'Theater of Pain': 45,
                    },
                    tyrannical:{
                        'De Other Side': 45,
                        'Halls of Atonement': 45,
                        'Mists of Tirna Scithe': 45,
                        'Plaguefall': 45,
                        'The Necrotic Wake': 45,
                        'Sanguine Depths': 45,
                        'Spires of Ascension': 45,
                        'Theater of Pain': 45,
                    }
                }
            },
            {
                class:1,
                name: "Baggins",
                realm: "icecrown",
                "best-runs": {
                    fortified:{
                        'De Other Side': 135,
                        'Halls of Atonement': 135,
                        'Mists of Tirna Scithe': 135,
                        'Plaguefall': 135,
                        'The Necrotic Wake': 135,
                        'Sanguine Depths': 135,
                        'Spires of Ascension': 135,
                        'Theater of Pain': 135,
                    },
                    tyrannical:{
                        'De Other Side': 135,
                        'Halls of Atonement': 135,
                        'Mists of Tirna Scithe': 135,
                        'Plaguefall': 135,
                        'The Necrotic Wake': 135,
                        'Sanguine Depths': 135,
                        'Spires of Ascension': 135,
                        'Theater of Pain': 135,
                    }
                }
            },
            {
                class:1,
                name: "Gwen",
                realm: "icecrown",
                "best-runs": {
                    fortified:{
                        'De Other Side': 0,
                        'Halls of Atonement': 115,
                        'Mists of Tirna Scithe': 115,
                        'Plaguefall': 115,
                        'The Necrotic Wake': 115,
                        'Sanguine Depths': 115,
                        'Spires of Ascension': 115,
                        'Theater of Pain': 115,
                    },
                    tyrannical:{
                        'De Other Side': 100,
                        'Halls of Atonement': 115,
                        'Mists of Tirna Scithe': 115,
                        'Plaguefall': 115,
                        'The Necrotic Wake': 115,
                        'Sanguine Depths': 115,
                        'Spires of Ascension': 115,
                        'Theater of Pain': 115,
                    }
                }
            },
            {
                class:1,
                name: "Newbie",
                realm: "icecrown",
                "best-runs": {
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
            },

        ]

        const wrapper = shallow(<RosterView roster={roster} baseAffix="fortified" dungeonKey={key} />)
        const tableBody = wrapper.find('tbody')
        const characterNames = tableBody.children().reduce((list:string[], tr) => {
            const characterName = tr.find('th').text()
            list.push(characterName);
            return list
        }, [])
        const firstThreeNames = characterNames.slice(0,3)
        expect(firstThreeNames).toEqual(expect.arrayContaining(['Jacatola','Ober', 'Rex']));

        expect(findRowFromName(tableBody, 'Jacatola').hasClass('master-achieved')).toEqual(true);
        expect(findRowFromName(tableBody, 'Ober').hasClass('explorer-achieved')).toEqual(true);
        expect(findRowFromName(tableBody, 'Rex').hasClass('conqueror-achieved')).toEqual(true);

        expect(findRowFromName(tableBody, 'Baggins').hasClass('explorer-achieved')).toEqual(false);
        expect(findRowFromName(tableBody, 'Rogueet').hasClass('explorer-achieved')).toEqual(false);
        expect(findRowFromName(tableBody, 'Gwen').hasClass('explorer-achieved')).toEqual(false);
        expect(findRowFromName(tableBody, 'Newbie').hasClass('explorer-achieved')).toEqual(false);

        expect(findRowFromName(tableBody, 'Rogueet').hasClass('conqueror-achieved')).toEqual(false);
        expect(findRowFromName(tableBody, 'Baggins').hasClass('conqueror-achieved')).toEqual(false);
        expect(findRowFromName(tableBody, 'Gwen').hasClass('conqueror-achieved')).toEqual(false);
        expect(findRowFromName(tableBody, 'Newbie').hasClass('conqueror-achieved')).toEqual(false);

        expect(findRowFromName(tableBody, 'Baggins').hasClass('master-achieved')).toEqual(false);
        expect(findRowFromName(tableBody, 'Rogueet').hasClass('master-achieved')).toEqual(false);
        expect(findRowFromName(tableBody, 'Gwen').hasClass('master-achieved')).toEqual(false);
        expect(findRowFromName(tableBody, 'Newbie').hasClass('master-achieved')).toEqual(false);

    })
})
    