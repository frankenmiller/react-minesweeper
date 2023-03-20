import React, { useState, useEffect } from "react";
import Button from "../Button/index";
import NumberDisplay from "../NumberDisplay";
import { generateCells, openMultipleCells } from "../../utils";
import { NO_OF_BOMBS } from "../../constants";
import { Face, Cell, CellState, CellValue } from "../../types";
import "./App.scss";
import { open } from "fs/promises";

const App: React.FC = () => {
    const [cells, setCells] = useState<Cell[][]>(generateCells());
    const [face, setFace] = useState<Face>(Face.smile);
    const [time, setTime] = useState<number>(0);
    const [live, setLive] = useState<boolean>(false);
    const [bombCount, setBombCount] = useState<number>(NO_OF_BOMBS);
    const [hasLost, setHasLost] = useState<boolean>(false);
    
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

    useEffect(() => { // <!------------------------ step on bombe useEffect()
        if (hasLost) {
            setFace(Face.dead);
            setLive(false);
        }
    }, [hasLost]); // <!---------------- close ----- step on bombe useEffect()

    const handleCellClick = (  // <!------------------------ handleCellClick()
        rowParam: number, colParam: number
    ) => (): void => {
        // console.log("You've clicked on row: ",rowParam, ", col: ", colParam);
        
        if (!live) {setLive(true);} // starts the game

        const currentCell = cells[rowParam][colParam];
        let newCells = cells.slice();

        if (currentCell.state === CellState.flagged || 
            currentCell.state === CellState.visible) {
            return;
        }
        if (currentCell.value === CellValue.bomb) {
            setHasLost(true);
            newCells[rowParam][colParam].red = true;
            newCells = showAllBombs();
            setCells(newCells);
        } else if (currentCell.value === CellValue.none) {
            newCells = openMultipleCells(newCells, rowParam, colParam);
            setCells(newCells);
        } else {
            newCells[rowParam][colParam].state = CellState.visible;
            setCells(newCells);
        }
    }; // <!---------------------------- close -------------- handleCellClick()

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
        } else if (currentCell.state === CellState.flagged) {
            currentCells[rowParam][colParam].state = CellState.open;
            setBombCount(bombCount + 1);
            setCells(currentCells);
        }
        // console.log("You've right-clicked row: ", rowParam, ", cell: ", colParam)
    }; // <!-------- right-click ----------- close ------- handleCellContext()

    const handleFaceClick = (): void => { // <!------------- handleFaceClick()
        if (live) {
            setLive(false);
            setTime(0);
            setBombCount(NO_OF_BOMBS);
            setCells(generateCells());
            setHasLost(false);
        }
    } // <!---------------------------- close -------------- handleFaceClick()

    const renderCells = (): React.ReactNode => { // <!---------- renderCells()
        return cells.map((row, rowIndex) => 
        row.map((cell, colIndex) => 
            <Button 
                key={`${rowIndex}-${colIndex}`} 
                row={rowIndex} col={colIndex}
                state={cell.state} value={cell.value} red={cell.red}
                onClick={handleCellClick}
                onContext={handleCellContext}
            />
        ) // inner-map
        ) // outer-map
    } // <!---------------------------------- close ------------- renderCells()

    const showAllBombs = (): Cell[][] => { // <!---------------- showAllBombs()
        const currentCells = cells.slice();
        return currentCells.map(row =>
          row.map(cell => {
            if (cell.value === CellValue.bomb) {
              return {
                ...cell,
                state: CellState.visible
              };
            }
            return cell;
          })
        );
      }; // <!------------------- close ----------------------- showAllBombs()    


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
    ) // return
}; // <!--------------------------------------------------- close ----- App()

export default App;