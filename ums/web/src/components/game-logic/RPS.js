import React, { Component } from "react";
import { withStyles } from '@material-ui/core/styles';
import { getUserEmail } from '../../firebase/auth'; 
import {
    Button, Typography
  } from '@material-ui/core';
import {HOST} from './BackendServerLocation';
const selection = ["rock", "paper", "scissors"];

const useStyles = theme => ({
    container: {
        margin: '1rem',
        display: 'flex',
        flexDirection: 'column',
        width: 'auto',
        flexGrow: 2,
        marginTop: 0,
    },
    selectionButton: {
        width: '100px',
        margin: '10px'
    },
    winner: {
        width: 'auto',
        height: 'auto',
        margin: '10px',
        color: '#990000',
        fontSize: '18px',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    playerImage: {
        height: '7rem',
        width: 'auto',
    },
    button: {
        width: '200px',
        marginTop: '1.5rem',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    images: {
        flexGrow: 1,
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        margin: 'auto',
        justifyContent: 'center',
    },
    autoMargin: {
        margin: 'auto',
        flexGrow: 1,
        display: 'flex',
        flexWrap: 'wrap',
        flexDirection: 'row',
        justifyContent: 'center',
    },
    title: {
        fontSize: '2rem',
        lineHeight: '36px',
        color: '#757575',
        fontWeight: 'bold',
        marginLeft: 'auto',
        marginRight: 'auto',
        textAlign: 'center',
    }
});
class RPS extends Component {
    constructor(props){
        super(props);


        this.state = {
            selected: false,
            gameId: "",
            user: 0,
            opponent: 0,
            opponentMove: "",
            winner: "",
            gameState: "",
            user1: "",
            user1move: "",
            user2move: "",
            rpsDisplaying: true,
            fetchUpdate: null
        };
    }
    componentDidMount() {
        //first have user join game
        fetch(`${HOST}/game/join/${'rps'}/${getUserEmail()}`,{
            method: 'POST',
            headers: { 'Content-type': 'application/json'}
        }).then(res => res.json()).then(response => this.setState({gameId: response.gameId}));
        this.setState({
            rpsDisplaying: true,
        });
        //handled in start
        
        this.setState({
            fetchUpdate: setInterval(() => {
            this.fetchRPSUpdate();
            }, 5000),
        })
        this.fetchRPSUpdate();
    }
    componentWillUnmount() {
        this.setState({
            rpsDisplaying: false,
            gameId: "",
        });
        clearInterval(this.state.fetchUpdate);
    }
    fetchRPSUpdate(){
        if(this.state.rpsDisplaying){
            try {
                if(this.state.gameId !== "") {
                    fetch(`${HOST}/game/${this.state.gameId}`)
                        .then(res => res.json())
                        .then((result) => {
                            if(result) {
                                this.setState({
                                    winner: result.winner,
                                    gameState: result.state,
                                    user1: result.user1,
                                    user1move: result.user1move,
                                    user2move: result.user2move
                                });
                            }
                        }
                        );
                }
            } catch(err) {console.log(err)}
        }
    }
    start = () => {
        fetch(`${HOST}/game/${this.state.gameId}/${this.state.user}/${getUserEmail()}`,{
            method: 'PUT',
        });
        // console.log(this.state.gameId);
        //sits in this loop until opponentMove is fetched
        this.setState({
         fetchUpdate : setInterval(() => {
            this.fetchRPSUpdate();
            if(this.state.gameState==="5"){
                //checks if opponent is user1 or user2
                if(this.state.user1===getUserEmail()){
                    this.setState({
                        opponentMove: this.state.user2move
                    })
                }
                else{
                    this.setState({
                        opponentMove: this.state.user1move
                    })
                }
                clearInterval(this.state.fetchUpdate);
            }
         }, 3000)
        });
        // let iterator = 0;
        // let gameUpdate = setInterval(() => {
        //     iterator++;
    
        //     this.setState({
        //         opponent: selection[Math.floor(Math.random() * 3)]
        //     });
        //     if(iterator > 4){
        //         clearInterval(gameUpdate);
        //         this.setState({
        //             opponent: selection[parseInt(this.state.opponentMove)],
        //             winner: this.selectWinner()
        //         });
        //     }
        // }, 100);
    };

    selectWinner = () => {
        const gameWinner = parseInt(this.state.winner);
        if(gameWinner===0 && this.state.user1===getUserEmail())
        {
            return "You win! Congrats on moving up the queue!";
        }
        else if(gameWinner===2){
            return "It's a tie! Neither player will gain additional points.";
        }
        else{
            return "You lost! Might be time to consider a different major.";
        }
    }
    selectChoice = selection => {
        //sends user input to back end
        this.setState({
            user: selection
        });
    };
    render(){
        const {user, opponent, winner} = this.state;
        const classes = this.props.classes;
        return (
            <div className={classes.container}>
                <Typography className={classes.title}>Rock, Paper, Scissors!</Typography>
                <div className={classes.images}>
                    {/* User */}
                    <img
                        className={classes.playerImage}
                        src={
                            user === "0" ? '/rpsAssets/rock.png' : user === "2" ? 'rpsAssets/scissors.png' : '/rpsAssets/paper.png'
                        }
                        alt=""
                        />
                    {/* Opponent */}
                    <img
                        className={classes.playerImage}
                        src={
                            opponent === "0" ? '/rpsAssets/rock.png' : opponent === "2" ? 'rpsAssets/scissors.png' : '/rpsAssets/paper.png'
                        }
                        alt=""
                        />
                </div>
                <div className={classes.autoMargin}>
                    <Button disabled={this.state.selected} className={classes.selectionButton} color={this.state.user === "0" ? "secondary" : "primary"} variant="contained" onClick={() => this.selectChoice("0")}>Rock</Button>
                    <Button disabled={this.state.selected} className={classes.selectionButton} color={this.state.user === "1" ? "secondary" : "primary"} variant="contained" onClick={() => this.selectChoice("1")}>Paper</Button>
                    <Button disabled={this.state.selected} className={classes.selectionButton} color={this.state.user === "2" ? "secondary" : "primary"} variant="contained" onClick={() => this.selectChoice("2")}>Scissors</Button>
                </div>
                <Button disabled={this.state.selected} className={classes.button} color="secondary" variant="contained" onClick={() => this.start()}>Lock In!</Button>
                <div className={classes.winner}>{winner ? this.selectWinner() : null}</div>
            </div>
        );
    }
}
export default withStyles(useStyles)(RPS);