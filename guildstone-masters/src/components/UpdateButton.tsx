import { FunctionComponent, useState } from 'react'
import { Member } from '../types';

import { functions } from '../firebase-init';

const updateGuild = functions.httpsCallable('updateGuild');

console.log(updateGuild)

type Props = {
    region: string,
    realm: string,
    name: string,
    setter: (roster:Member[]) => void
}

const UpdateButton:FunctionComponent<Props> = ({region, realm, name, setter}) => {
    
    const [text, setText] = useState('Update')

    const update = async () => { 
        setText('Updating ...')
        const newRoster = await updateGuild({
            region,
            realm,
            name
        })
        setter(newRoster.data)
        setText('Updated')
    }
    
    return<button onClick={update} className='button'>
        {text}
    </button>
}

export default UpdateButton;