import React from 'react';
import classes from './Search.module.css';
import { connect } from 'react-redux';
import SVG from '../../../SVG/SVG';

const Search = (props) => {
    
    const getInputHandler = (event) => {
        props.onSearchInput(event.target.value); 
    };
    
    return (
        <form className={classes.Search}>
            <input className={classes.Input}
                type='text' 
                placeholder='Summoner Name'
                onChange={getInputHandler}
                value={props.searchTerm}
                maxLength={15}
            />
            <button type='submit' className={classes.Button} onClick={props.findSummoner}>
                <SVG className={classes.Icon} iconName="icon-zoom-outline"/>
            </button>
        </form>
    );
}

const mapStateToProps = ({summoner, search}) => {
    return {
        searchTerm: search.searchTerm,
        findSummoner: summoner.findSummonerHandler
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSearchInput: (searchTerm) => dispatch(
            {
              type:'GET_INPUT', 
              payload: { searchTerm }
            }
        )
    };
};



export default connect(mapStateToProps, mapDispatchToProps)(Search);