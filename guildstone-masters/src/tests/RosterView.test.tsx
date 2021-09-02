import React from 'react';
import { shallow } from 'enzyme';

import RosterView from '../components/RosterView';
import { Member } from '../types';

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
