import React, { useState, useEffect } from "react";
import Button from "../Button/index";
import NumberDisplay from "../NumberDisplay";
import { generateCells } from "../../utils";
import { Face } from "../../types";
import "./App.scss";

const App: React.FC = () => {
    const [cells, setCells] = useState(generateCells());
    const [face, setFace] = useState(Face.smile);
    
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

    const renderCells = (): React.ReactNode => {
        return cells.map((row, rowIndex) => 
        row.map((cell, colIndex) => 
            <Button 
                key={`${rowIndex}-${colIndex}`} 
                row={rowIndex} col={colIndex}
                state={cell.state} value={cell.value}
            />
        ))
    }

    return (
        <div className="App">
            <div id="monkeez">
                Frankenmiller's Minesweeper <br /> Game created Jan 2023 <br /> in React using Typescript
            </div>
            <div className="Header">
                <NumberDisplay value={50} />
                <div className="face">
                    <span role="img" aria-label="face">{face}</span>
                </div>
                <NumberDisplay value={23} />
            </div>
            <div className="Body">{renderCells()}</div>
        </div>
    )
};

export default App;