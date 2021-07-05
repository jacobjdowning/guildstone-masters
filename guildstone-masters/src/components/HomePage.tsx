import React from 'react';
import { FunctionComponent } from 'react';
import Card from './CardView';


const HomePage:FunctionComponent = () => {
    return <React.Fragment>
        <h1> Guildstone Masters </h1>
        <Card>
            <form>
                <select>
                    <option value='us'>US</option>
                    <option value='eu'>EU</option>
                    <option value='cn'>CN</option>
                    <option value='kr'>KR</option>
                    <option value='tw'>TW</option>
                </select>
                <label>Realm:</label>
                <input type="text"></input>
                <label>Guild</label>
                <input type="text"></input>
            </form>
        </Card>
    </React.Fragment>
}

export default HomePage;