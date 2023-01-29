import React, { useState, useEffect } from "react";
import Button from "../Button/index";
import NumberDisplay from "../NumberDisplay";
import { generateCells } from "../../utils";
import { Face, Cell } from "../../types";
import "./App.scss";

const App: React.FC = () => {
    const [cells, setCells] = useState<Cell[][]>(generateCells());
    const [face, setFace] = useState<Face>(Face.smile);
    const [time, setTime] = useState<number>(0);
    const [live, setLive] = useState<boolean>(false);
    
    useEffect(() => {
        const handleMoundDown = (): void => {
            setFace(Face.apprehension);
        }
        const handleMoundUp = (): void => {
            setFace(Face.smile);
        }
        window.addEventListener('mousedown', handleMoundDown);
        window.addEventListener('mouseup', handleMoundUp);
        return () => {
            window.removeEventListener("mousedown", handleMoundDown);
            window.removeEventListener("mouseup", handleMoundUp);
        }
    }, []);

    const handleCellClick = (rowParam: number, colParam: number) => (): void => {
        console.log("You clicked on row: ",rowParam, ", col: ", colParam);
    }

    const renderCells = (): React.ReactNode => { // <!---------- renderCells()
        return cells.map((row, rowIndex) => 
        row.map((cell, colIndex) => 
            <Button 
                key={`${rowIndex}-${colIndex}`} 
                row={rowIndex} col={colIndex}
                state={cell.state} value={cell.value}
                onClick={handleCellClick}
            />
        ))
    } // <!----------------------------------------------------- renderCells()

    return (
        <div className="App">
            <div id="monkeez">
                Frankenmiller's Minesweeper <br /> Game created Jan 2023 <br /> in React using Typescript
            </div>
            <div className="Header">
                <NumberDisplay value={10} />
                <div className="face">
                    <span role="img" aria-label="face">{face}</span>
                </div>
                <NumberDisplay value={0} />
            </div>
            <div className="Body">{renderCells()}</div>
        </div>
    )
};

export default App;