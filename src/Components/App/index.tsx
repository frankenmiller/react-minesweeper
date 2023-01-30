import React, { useState, useEffect } from "react";
import Button from "../Button/index";
import NumberDisplay from "../NumberDisplay";
import { generateCells } from "../../utils";
import { NO_OF_BOMBS } from "../../constants";
import { Face, Cell, CellState } from "../../types";
import "./App.scss";

const App: React.FC = () => {
    const [cells, setCells] = useState<Cell[][]>(generateCells());
    const [face, setFace] = useState<Face>(Face.smile);
    const [time, setTime] = useState<number>(0);
    const [live, setLive] = useState<boolean>(false);
    const [bombCount, setBombCount] = useState<number>(NO_OF_BOMBS);
    
    useEffect(() => { // <!--------------- handleMouse up/down useEffect()
        const handleMouseDown = (): void => {
            setFace(Face.apprehension);
        }
        const handleMouseUp = (): void => {
            setFace(Face.smile);
        }
        window.addEventListener('mousedown', handleMouseDown);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener("mousedown", handleMouseDown);
            window.removeEventListener("mouseup", handleMouseUp);
        }
    }, []); // <!--------- close ----------- handleMouse up/down useEffect()

    useEffect (() => { // <!------------------------ start timer useEffect()
        if (live && time < 999) {
            const timer = setInterval(() => {
                // console.log("the Time: ", time, " secs...");
                setTime(time + 1);
            }, 1000);
            return () => {
                clearInterval(timer);
            }; // return statement
        } // if statement
    }, [live, time]); // <!------------ close -------- start timer useEffect()

    const handleCellClick = (
        rowParam: number, colParam: number
    ) => (): void => {
        console.log("You've clicked on row: ",rowParam, ", col: ", colParam);
        if (!live) { // starts the game
            setLive(true);
        }
    } // <!---------------------------- close -------------- handleCellClick()

    const handleCellContext = ( // <!--- right-click ----- handleCellContext()
        rowParam: number, colParam: number
    ) => (e: React.MouseEvent<HTMLDivElement, MouseEvent>): void => {
        e.preventDefault();

        if (!live) { return; } // if timer not ticking just do nothing

        const currentCells = cells.slice();
        const currentCell = cells[rowParam][colParam];

        if (currentCell.state === CellState.visible) {
            return;
        } else if (currentCell.state === CellState.open) {
            currentCells[rowParam][colParam].state = CellState.flagged;
            setCells(currentCells);
            setBombCount(bombCount - 1);
        }
        console.log("You've right-clicked row: ", rowParam, ", cell: ", colParam)
    }; // <!-------- right-click ----------- close ------- handleCellContext()

    const handleFaceClick = (): void => { // <!------------- handleFaceClick()
        if (live) {
            setLive(false);
            setTime(0);
            setBombCount(NO_OF_BOMBS);
            setCells(generateCells());
        }
    } // <!---------------------------- close -------------- handleFaceClick()

    const renderCells = (): React.ReactNode => { // <!---------- renderCells()
        return cells.map((row, rowIndex) => 
        row.map((cell, colIndex) => 
            <Button 
                key={`${rowIndex}-${colIndex}`} 
                row={rowIndex} col={colIndex}
                state={cell.state} value={cell.value}
                onClick={handleCellClick}
                onContext={handleCellContext}
            />
        ))
    } // <!---------------------------------- close ------------- renderCells()

    return (
        <div className="App">
            <div id="monkeez">
                Frankenmiller's Minesweeper <br /> Game created Jan 2023 <br /> in React using Typescript
            </div>
            <div className="Header">
                <NumberDisplay value={bombCount} />
                <div className="face" onClick={handleFaceClick} >
                    <span role="img" aria-label="face">{face}</span>
                </div>
                <NumberDisplay value={time} />
            </div>
            <div className="Body">{renderCells()}</div>
        </div>
    )
};

export default App;