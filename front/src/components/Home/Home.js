import React from 'react';
import {Link} from 'react-router-dom';
import HeaderPrimary from '../HeaderPrimary/HeaderPrimary';
import Jumbotron from '../Jumbotron/Jumbotron';
import Button from '../Button/Button';
import MainText from './MainText/MainText';
import classes from './Home.module.css';

const Home = () => {
    return (
        <div className={classes.Home}>
            <HeaderPrimary type='Animated' util='m-b-medium'>
                This is the home page of the website
            </HeaderPrimary>
            <Jumbotron>
                <MainText>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
                </MainText>
                <Link to='/summoner'>
                    <Button type='PrimaryAnimated'>
                        Start
                    </Button>
                </Link>
            </Jumbotron>
        </div>
    );
};

export default Home;