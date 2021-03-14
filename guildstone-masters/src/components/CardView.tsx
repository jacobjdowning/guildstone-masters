import { FunctionComponent } from 'react';

type Props = {
    gridClass?:string
}

const Card: FunctionComponent<Props> = ({ children, gridClass }) => <div className={`card ${gridClass}`}> {children} </div>
export default Card;