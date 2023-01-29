import React, { useState } from "react";
import NumberDisplay from "../NumberDisplay";
import { GenerateCells } from "../../utils";
import "./App.scss";

const App: React.FC = () => {
    const [cells, setCells] = useState(GenerateCells());
    console.log("cells", cells);

    return (
        <div className="App">
            <div className="Header">
                <NumberDisplay value={50} />
                <div className="face">
                    <span role="img" aria-label="face">😁</span>
                </div>
                <NumberDisplay value={23} />
            </div>
            <div className="Body">
                BODY
            </div>
        </div>
    )
};

export default App;