import React, { useState } from "react";
import Button from "../Button/index";
import NumberDisplay from "../NumberDisplay";
import { GenerateCells } from "../../utils";
import "./App.scss";

const App: React.FC = () => {
    const [cells, setCells] = useState(GenerateCells());
    const renderCells = (): React.ReactNode => {
        return cells.map((row, rowIndex) => 
        row.map((cell, colIndex) => 
            <Button 
                key={`${rowIndex}-${colIndex}`} 
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
                    <span role="img" aria-label="face">😁</span>
                </div>
                <NumberDisplay value={23} />
            </div>
            <div className="Body">{renderCells()}</div>
        </div>
    )
};

export default App;