import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import App from "./Components/App";

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <div className="gorillaz">
      <div className="monkeez">
        Frankenmiller's Minesweeper Game created  <br /> January 2023 in React using Typescript
      </div>
    </div>
    <App />
  </React.StrictMode>
);

