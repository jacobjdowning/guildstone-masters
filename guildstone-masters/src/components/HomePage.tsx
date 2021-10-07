import React, { useState } from 'react';
import { FunctionComponent } from 'react';
import { useHistory } from 'react-router-dom';

import Card from './CardView';
import { slugify } from '../logic/stringUtils';

const HomePage:FunctionComponent = () => {
    const history = useHistory();

    const [region, setRegion] = useState<string>('US');
    const [realmName, setRealmName] = useState<string>('');
    const [guildName, setGuildName] = useState<string>('');

    function changeRegion(event:React.ChangeEvent<HTMLSelectElement>){
        setRegion(event.target.value)
    }
    function changeRealmName(event:React.ChangeEvent<HTMLInputElement>){
        //change to slug
        setRealmName(event.target.value)
    }
    function changeGuildName(event:React.ChangeEvent<HTMLInputElement>){
        //change to slug
        setGuildName(event.target.value)
    }
    function confirmGuild(event:React.MouseEvent<HTMLInputElement>){
        history.push(`/${region}/${slugify(realmName)}/${slugify(guildName)}`)
        event.preventDefault()
    }

    return <React.Fragment>
        <h1> Guildstone Masters </h1>
        <Card>
            <form>
                <select value={region} onChange={changeRegion}>
                    <option value='us'>US</option>
                    <option value='eu'>EU</option>
                    <option value='cn'>CN</option>
                    <option value='kr'>KR</option>
                    <option value='tw'>TW</option>
                </select>
                <label htmlFor="realm-name">Realm:</label>
                <input type="text" id="realm-name" value={realmName} onChange={changeRealmName}></input>
                <label htmlFor="guild-name">Guild:</label>
                <input type="text" id="guild-name" value={guildName} onChange={changeGuildName}></input>
                <input type="submit" value="Go" onClick={confirmGuild}/>
            </form>
        </Card>
    </React.Fragment>
}

export default HomePage;