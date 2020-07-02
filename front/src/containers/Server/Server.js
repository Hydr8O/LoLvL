import React, {useState} from 'react';
import Classes from './Server.module.css';
import DropItem from '../../components/Layout/Navbar/Dropdown/DropItem/DropItem';
import Dropdown from '../../components/Layout/Navbar/Dropdown/Dropdown';
import ServerButton from './ServerButton/ServerButton';
import CSSTransition from 'react-transition-group/CSSTransition';
import Transitions from './Transitions/Transitions.module.css';

const servers = ['ru', 'br1', 'eun1', 'euw1', 'na1', 'la1', 'la2', 'oc1', 'tr1', 'jp1', 'kr', 'tw'];

const Server = ({changeServer, server}) => {

    const [isShown, setIsShown] = useState(false);
    const [activeServer, setActiveServer] = useState(server);

    const toggleDropHandler = () => {
        setIsShown(!isShown);
    };

    const changeServerHandler = (server) => {
        setActiveServer(server);
        changeServer(server);
        toggleDropHandler();
    }

    const dropDownItems = servers.map(server => (
        <DropItem 
        key={server} 
        active={activeServer} 
        onClick={changeServerHandler} 
        id={server}
        >
            {server}
        </DropItem>
    ));

    return (
        <div className={Classes.Server}>
            <ServerButton onClick={toggleDropHandler}>
                {server}
            </ServerButton>
            <CSSTransition 
            in={isShown} 
            timeout={300} 
            classNames={Transitions}
            unmountOnExit>
                <Dropdown isShown={isShown} toggle={toggleDropHandler}>
                    {dropDownItems}
                </Dropdown>
              </CSSTransition>
        </div>
    );
};

export default Server;