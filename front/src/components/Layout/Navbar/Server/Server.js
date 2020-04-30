import React, {useState} from 'react';
import Classes from './Server.module.css';
import DropItem from '../Dropdown/DropItem/DropItem';
import Dropdown from '../Dropdown/Dropdown';
import CSSTransition from 'react-transition-group/CSSTransition';
import Transitions from './Transitions/Transitions.module.css';
import ServerIcon from './ServerIcon/ServerIcon';

const Server = ({children}) => {

    const [isShown, setIsShown] = useState(false);

    const toggleDropHandler = () => {
        setIsShown(!isShown);
    };

    return (
        <div className={Classes.Server}>
            <button onClick={toggleDropHandler}>RU</button>
            <CSSTransition 
            in={isShown} 
            timeout={300} 
            classNames={Transitions}
            unmountOnExit>
                <Dropdown isShown={isShown} toggle={toggleDropHandler}>
                    <DropItem>
                        RU
                    </DropItem>
                    <DropItem>
                        BR
                    </DropItem>
                    <DropItem>
                        EUNE
                    </DropItem>
                    <DropItem>
                        EUW
                    </DropItem>
                    <DropItem>
                        NA
                    </DropItem>
                    <DropItem>
                        LAN
                    </DropItem>
                    <DropItem>
                        LAS
                    </DropItem>
                    <DropItem>
                        OSE
                    </DropItem>
                    <DropItem>
                        TR
                    </DropItem>
                    <DropItem>
                        JP
                    </DropItem>
                    <DropItem>
                        KR
                    </DropItem>
                    <DropItem>
                        TW
                    </DropItem>
                </Dropdown>
              </CSSTransition>
        </div>
    );
};

export default Server;