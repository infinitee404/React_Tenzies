import React, { useEffect, useRef, useState } from "react";
import "./styles.css"
import {nanoid} from "nanoid"
import Confetti from "react-confetti";
import Die from "./Die"

const App = () => {

    const [dice, setDice] = useState(allNewDice)
    const [tenzies, setTenzies] = useState(false)
    
    const [rollCount, setRollCount] = useState(0)
    const [time, setTime] = useState({
        seconds: 0,
        milliseconds: 0
      });
    const [timeIsRunning, setTimeIsRunning] = useState(false)

    let highScore = NaN
    const intervalRef = useRef(null)
    
    const dieArray = dice.map(die => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld}
            holdDice={() => holdDice(die.id)}
        />
    ))

    function formatTime(time) {
        const formattedSeconds = time.seconds < 10 ? `0${time.seconds}` : time.seconds;
        const formattedMilliseconds = time.milliseconds
            .toString()
            .padStart(2, "0")
            .slice(0, 2);
        return `${formattedSeconds}.${formattedMilliseconds}`;
    }

    function generateNewDie(){
        return {
            value: Math.ceil(Math.random() * 6), 
            isHeld: false,
            id: nanoid()
        }
    }

    function allNewDice(){
        const newDice = []
        for (let i=0; i<10; i++){
            newDice.push(generateNewDie())
        }
        return(newDice)
    }

    function checkGameOver() {
        if (tenzies === true) {
            setDice(allNewDice)
            setRollCount(-1)
            checkHighScore()
            setTime({
                seconds: 0, 
                milliseconds: 0
            })
            setTenzies(prevState => !prevState)
        }
        rollDice()
      }
      

    function checkHighScore(){
        if (highScore == NaN || rollCount < localStorage.getItem("highScore"))
            localStorage.setItem("highScore", rollCount)
    }

    function rollDice(){
        const heldDice = []
        setRollCount(prevCount => prevCount + 1)
        setDice(oldDice => oldDice.map(die => {
            return die.isHeld ?
                die :
                generateNewDie()
        }))
        allNewDice(heldDice.len)
    }

    function holdDice(id){
        handleStartTime()
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ?
                {...die, isHeld: !die.isHeld} :
                {...die}
        }))
    }

    function handleStartTime() {
        if (timeIsRunning || tenzies) return; // don't start if time is running or tenzies is true
        setTimeIsRunning(true);
        intervalRef.current = setInterval(() => {
          setTime((prevTime) => {
            const newMilliseconds = prevTime.milliseconds + 10;
            const newSeconds = prevTime.seconds + Math.floor(newMilliseconds / 1000);
      
            return {
              seconds: newSeconds,
              milliseconds: newMilliseconds % 1000,
            };
          });
        }, 10);
      }
    
    
    function handleStopTime(){
        clearInterval(intervalRef.current)
        setTimeIsRunning(false)
    }

    React.useEffect(()=>{
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allValues = dice.every(die => die.value === firstValue)
        
        if (allHeld && allValues){
            setTenzies(true)
        }
    }, [dice])

    useEffect(() => {
        if(tenzies) {
            handleStopTime();
        }
    }, [tenzies])

    return (
        <main>
            {tenzies && <Confetti width={window.innerWidth} height={window.innerHeight}/>}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {dieArray}
            </div>
            <button 
                className="roll-button"
                onClick={() => {checkGameOver(); handleStartTime()}}
            >
                {tenzies ? "New Game" : "Roll"}
            </button>
            <div className="stats">
                <div className="scores">
                    <h4>
                        {rollCount < 2 ? "Roll: " : "Rolls: "}
                        {rollCount}
                    </h4>
                    <h6>
                        Best Score: {localStorage.getItem("highScore")}
                    </h6>
                </div>
                <div className="times">
                    <h4>
                        Time: {formatTime(time)}
                    </h4>
                    <h6>
                        Best Time: 0
                    </h6>
                </div>
            </div>
        </main>
    )
}

export default App
