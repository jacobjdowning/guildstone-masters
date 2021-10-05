import React from 'react';
import { shallow } from 'enzyme';

import HomePage from '../components/HomePage';
import { useHistory } from 'react-router-dom';

jest.mock('react-router', () => {
    const originalModule = jest.requireActual('react-router')
    const push = jest.fn()
    return {
        __esModule:true,
        ...originalModule,
        useHistory: () => {
            return { push: push }
        }
    }
})

describe('Tests around the homepage of the app, where users select their guild', () => {
    test('Homepage has all its components to select a guild', ()=> {
        const wrapper = shallow(<HomePage />)
        expect(wrapper.containsAllMatchingElements([
            <label htmlFor="realm-name">Realm:</label>,
            <label htmlFor="guild-name">Guild:</label>,
            <input type="text" id="realm-name"></input>,
            <input type="text" id="guild-name"></input>,
            <option value='us'>US</option>,
            <option value='eu'>EU</option>,
            <option value='kr'>KR</option>,
            <input type="submit" value="Go"/>
        ])).toEqual(true)

    })

    test('When a region, realm, and guild name are entered and the submit button' +
    ' is clicked, the user should be sent to the correct GuildProfile with the correct ' +
    ' props - tested with mocked \'useHistory\' hook', ()=>{
        
        const wrapper = shallow(<HomePage />);
        wrapper.find('select').simulate('change', {target:{value: 'us'}})
        wrapper.find('#realm-name').simulate('change', {target:{value:'Icecrown'}})
        wrapper.find('#guild-name').simulate('change', {target:{value:'French Toast'}})
        wrapper.find('input[type=\"submit\"]').simulate('click', {preventDefault: jest.fn()})

        expect(useHistory().push).toBeCalledWith('/us/icecrown/french-toast') 
    })

    test('guild and realm names with spaces and apostropes are handled' + 
    ' correctly - tested with mocked \'useHistory\' hook', ()=> {

        const wrapper = shallow(<HomePage />);
        wrapper.find('select').simulate('change', {target:{value: 'us'}})
        wrapper.find('#realm-name').simulate('change', {target:{value:'Kil\'jaeden'}})
        wrapper.find('#guild-name').simulate('change', {target:{value:'Alea Iacta Est'}})
        wrapper.find('input[type=\"submit\"]').simulate('click', {preventDefault: jest.fn()})

        expect(useHistory().push).toBeCalledWith('/us/kiljaeden/alea-iacta-est')     
    
    })
})