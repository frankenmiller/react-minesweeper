import { MAX_COLS, MAX_ROWS, NO_OF_BOMBS } from "../constants";
import { Cell, CellState, CellValue } from "../types";

const grabAllAdjacentCells = (
  cells: Cell[][],
  rowParam: number,
  colParam: number
): {
  topLeftCell: Cell | null;
  topCell: Cell | null;
  topRightCell: Cell | null;
  leftCell: Cell | null;
  rightCell: Cell | null;
  bottomLeftCell: Cell | null;
  bottomCell: Cell | null;
  bottomRightCell: Cell | null;
} => {
  const topLeftCell =
    rowParam > 0 && colParam > 0 ? cells[rowParam - 1][colParam - 1] : null;
  const topCell = rowParam > 0 ? cells[rowParam - 1][colParam] : null;
  const topRightCell =
    rowParam > 0 && colParam < MAX_COLS - 1
      ? cells[rowParam - 1][colParam + 1]
      : null;
  const leftCell = colParam > 0 ? cells[rowParam][colParam - 1] : null;
  const rightCell =
    colParam < MAX_COLS - 1 ? cells[rowParam][colParam + 1] : null;
  const bottomLeftCell =
    rowParam < MAX_ROWS - 1 && colParam > 0
      ? cells[rowParam + 1][colParam - 1]
      : null;
  const bottomCell =
    rowParam < MAX_ROWS - 1 ? cells[rowParam + 1][colParam] : null;
  const bottomRightCell =
    rowParam < MAX_ROWS - 1 && colParam < MAX_COLS - 1
      ? cells[rowParam + 1][colParam + 1]
      : null;

  return {
    topLeftCell,
    topCell,
    topRightCell,
    leftCell,
    rightCell,
    bottomLeftCell,
    bottomCell,
    bottomRightCell
  };
};

export const generateCells = (): Cell[][] => {
  let cells: Cell[][] = [];

  // generating all cells
  for (let row = 0; row < MAX_ROWS; row++) {
    cells.push([]);
    for (let col = 0; col < MAX_COLS; col++) {
      cells[row].push({
        value: CellValue.none,
        state: CellState.open
      });
    }
  }

  // randomly put 10 bombs
  let bombsPlaced = 0;
  while (bombsPlaced < NO_OF_BOMBS) {
    const randomRow = Math.floor(Math.random() * MAX_ROWS);
    const randomCol = Math.floor(Math.random() * MAX_COLS);

    const currentCell = cells[randomRow][randomCol];
    if (currentCell.value !== CellValue.bomb) {
      cells = cells.map((row, rowIndex) =>
        row.map((cell, colIndex) => {
          if (randomRow === rowIndex && randomCol === colIndex) {
            return {
              ...cell,
              value: CellValue.bomb
            };
          }

          return cell;
        })
      );
      bombsPlaced++;
    }
  }

  // calculate the numbers for each cell
  for (let rowIndex = 0; rowIndex < MAX_ROWS; rowIndex++) {
    for (let colIndex = 0; colIndex < MAX_COLS; colIndex++) {
      const currentCell = cells[rowIndex][colIndex];
      if (currentCell.value === CellValue.bomb) {
        continue;
      }

      let numberOfBombs = 0;
      const {
        topLeftCell,
        topCell,
        topRightCell,
        leftCell,
        rightCell,
        bottomLeftCell,
        bottomCell,
        bottomRightCell
      } = grabAllAdjacentCells(cells, rowIndex, colIndex);

      if (topLeftCell?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (topCell?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (topRightCell?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (leftCell?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (rightCell?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (bottomLeftCell?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (bottomCell?.value === CellValue.bomb) {
        numberOfBombs++;
      }
      if (bottomRightCell?.value === CellValue.bomb) {
        numberOfBombs++;
      }

      if (numberOfBombs > 0) {
        cells[rowIndex][colIndex] = {
          ...currentCell,
          value: numberOfBombs
        };
      }
    }
  }

  return cells;
};

export const openMultipleCells = (
  cells: Cell[][],
  rowParam: number,
  colParam: number
): Cell[][] => {
  const currentCell = cells[rowParam][colParam];

  if (
    currentCell.state === CellState.visible ||
    currentCell.state === CellState.flagged
  ) {
    return cells;
  }

  let newCells = cells.slice();
  newCells[rowParam][colParam].state = CellState.visible;

  const {
    topLeftCell,
    topCell,
    topRightCell,
    leftCell,
    rightCell,
    bottomLeftCell,
    bottomCell,
    bottomRightCell
  } = grabAllAdjacentCells(cells, rowParam, colParam);

  if (
    topLeftCell?.state === CellState.open &&
    topLeftCell.value !== CellValue.bomb
  ) {
    if (topLeftCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam - 1, colParam - 1);
    } else {
      newCells[rowParam - 1][colParam - 1].state = CellState.visible;
    }
  }

  if (topCell?.state === CellState.open && topCell.value !== CellValue.bomb) {
    if (topCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam - 1, colParam);
    } else {
      newCells[rowParam - 1][colParam].state = CellState.visible;
    }
  }

  if (
    topRightCell?.state === CellState.open &&
    topRightCell.value !== CellValue.bomb
  ) {
    if (topRightCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam - 1, colParam + 1);
    } else {
      newCells[rowParam - 1][colParam + 1].state = CellState.visible;
    }
  }

  if (leftCell?.state === CellState.open && leftCell.value !== CellValue.bomb) {
    if (leftCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam, colParam - 1);
    } else {
      newCells[rowParam][colParam - 1].state = CellState.visible;
    }
  }

  if (
    rightCell?.state === CellState.open &&
    rightCell.value !== CellValue.bomb
  ) {
    if (rightCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam, colParam + 1);
    } else {
      newCells[rowParam][colParam + 1].state = CellState.visible;
    }
  }

  if (
    bottomLeftCell?.state === CellState.open &&
    bottomLeftCell.value !== CellValue.bomb
  ) {
    if (bottomLeftCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam + 1, colParam - 1);
    } else {
      newCells[rowParam + 1][colParam - 1].state = CellState.visible;
    }
  }

  if (
    bottomCell?.state === CellState.open &&
    bottomCell.value !== CellValue.bomb
  ) {
    if (bottomCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam + 1, colParam);
    } else {
      newCells[rowParam + 1][colParam].state = CellState.visible;
    }
  }

  if (
    bottomRightCell?.state === CellState.open &&
    bottomRightCell.value !== CellValue.bomb
  ) {
    if (bottomRightCell.value === CellValue.none) {
      newCells = openMultipleCells(newCells, rowParam + 1, colParam + 1);
    } else {
      newCells[rowParam + 1][colParam + 1].state = CellState.visible;
    }
  }

  return newCells;
};

// import React from "react";
// import { MAX_ROWS, MAX_COLS, NO_OF_BOMBS } from "../constants";
// import { CellValue, CellState, Cell } from "../types";

// const grabAllAdjacentCells = ( // <!------------------ grabAllAdjacentCells()
//   cells: Cell[][], rowParam: number, colParam: number
// ): { // types of the outputs
//   topLeftCell: Cell | null;
//   topCell: Cell | null;
//   topRightCell: Cell | null;
//   leftCell: Cell | null;
//   rightCell: Cell | null;
//   bottomLeftCell: Cell | null;
//   bottomCell: Cell | null;
//   bottomRightCell: Cell | null;
// } => {
//   const topLeftCell = rowParam>0 && colParam>0 ? cells[rowParam-1][colParam-1] : null;
//   const topCell = rowParam > 0 ? cells[rowParam-1][colParam] : null;
//   const topRightCell = rowParam>0 && colParam<MAX_COLS-1 ? cells[rowParam-1][colParam+1] : null;
//   const leftCell = colParam > 0 ? cells[rowParam][colParam-1] : null;
//   const rightCell = colParam < MAX_COLS -1 ? cells[rowParam][colParam+1] : null;
//   const bottomLeftCell = rowParam<MAX_ROWS-1 && colParam>0 ? cells[rowParam+1][colParam-1] : null;
//   const bottomCell = rowParam<MAX_ROWS-1 ? cells[rowParam+1][colParam] : null;
//   const bottomRightCell = rowParam<MAX_ROWS-1 && colParam<MAX_COLS-1 ?cells[rowParam+1][colParam+1] : null;

//   return {
//     topLeftCell,
//     topCell,
//     topRightCell,
//     leftCell,
//     rightCell,
//     bottomLeftCell,
//     bottomCell,
//     bottomRightCell
//   }
// };  // <!---------------------------------- close ------ grabAllAdjacentCells()

// export const generateCells = (): Cell[][] => {
//     let cells: Cell[][] = [];
  
//     // generating all cells
//     for (let row = 0; row < MAX_ROWS; row++) {
//       cells.push([]);
//       for (let col = 0; col < MAX_COLS; col++) {
//         cells[row].push({
//           value: CellValue.none,
//           state: CellState.open
//         });
//       }
//     }

//   // randomly put 10 bombs
//   let bombsPlaced = 0;
//   while (bombsPlaced < NO_OF_BOMBS) {
//     const randomRow = Math.floor(Math.random() * MAX_ROWS);
//     const randomCol = Math.floor(Math.random() * MAX_COLS);

//     const currentCell = cells[randomRow][randomCol];
//     if (currentCell.value !== CellValue.bomb) {
//       cells = cells.map((row, rowIndex) =>
//         row.map((cell, colIndex) => {
//           if (randomRow === rowIndex && randomCol === colIndex) {
//             return {
//               ...cell,
//               value: CellValue.bomb
//             };
//           }
//           return cell;
//         })
//       );
//       bombsPlaced++;
//     } // if statement
//   } // while loop

//   // calculate the numerals that correspond w/cells adjacent to bombs
//   for (let rowIndex=0; rowIndex<MAX_ROWS; rowIndex++) {
//     for (let colIndex=0; colIndex<MAX_COLS; colIndex++) {
//         const currentCell = cells[rowIndex][colIndex];
//         if (currentCell.value === CellValue.bomb) {
//             continue;
//         }
//         let numberOfBombs = 0;

//         const {
//           topLeftCell,
//           topCell,
//           topRightCell,
//           leftCell,
//           rightCell,
//           bottomLeftCell,
//           bottomCell,
//           bottomRightCell
//         } = grabAllAdjacentCells(cells, rowIndex, colIndex);

//         // const topLeftCell = rowIndex>0 && colIndex>0 ? cells[rowIndex-1][colIndex-1] : null;
//         // const topCell = rowIndex > 0 ? cells[rowIndex-1][colIndex] : null;
//         // const topRightCell = rowIndex>0 && colIndex<MAX_COLS-1 ? cells[rowIndex-1][colIndex+1] : null;
//         // const leftCell = colIndex > 0 ? cells[rowIndex][colIndex-1] : null;
//         // const rightCell = colIndex < MAX_COLS -1 ? cells[rowIndex][colIndex+1] : null;
//         // const bottomLeftCell = rowIndex<MAX_ROWS-1 && colIndex>0 ? cells[rowIndex+1][colIndex-1] : null;
//         // const bottomCell = rowIndex<MAX_ROWS-1 ? cells[rowIndex+1][colIndex] : null;
//         // const bottomRightCell = rowIndex<MAX_ROWS-1 && colIndex<MAX_COLS-1 ?cells[rowIndex+1][colIndex+1] : null;

//         if (topLeftCell && topLeftCell.value === CellValue.bomb) {
//             numberOfBombs++;
//         }
//         if (topCell && topCell.value === CellValue.bomb) {
//             numberOfBombs++;
//         }
//         if (topRightCell && topRightCell.value === CellValue.bomb) {
//             numberOfBombs++;
//         }
//         if (leftCell && leftCell.value === CellValue.bomb) {
//             numberOfBombs++;
//         }
//         if (rightCell && rightCell.value === CellValue.bomb) {
//             numberOfBombs++;
//         }
//         if (bottomLeftCell && bottomLeftCell.value === CellValue.bomb) {
//             numberOfBombs++;
//         }
//         if (bottomCell && bottomCell.value === CellValue.bomb) {
//             numberOfBombs++;
//         }
//         if (bottomRightCell && bottomRightCell.value === CellValue.bomb) {
//             numberOfBombs++;
//         }
//         if (numberOfBombs > 0) {
//             cells[rowIndex][colIndex] = {
//                 ...currentCell,
//                 value: numberOfBombs
//             }
//         }

//     } // inner for-loop
//   } // outer for-loop

//     return cells;
// }; // <!-------------------------------------- close ------- generateCells()

// export const openMultipleCells = ( // <!----------------- openMultipleCells()
//   cells: Cell[][], 
//   rowParam: number, 
//   colParam: number
// ): Cell[][] => {
//   const currentCell = cells[rowParam][colParam];

//   if (
//     currentCell.state === CellState.visible || 
//     currentCell.state === CellState.flagged
//   ) {
//       return cells;
//   }
  
//   let newCells = cells.slice();

//   newCells[rowParam][colParam].state = CellState.visible;
//   const {
//     topLeftCell,
//     topCell,
//     topRightCell,
//     leftCell,
//     rightCell,
//     bottomLeftCell,
//     bottomCell,
//     bottomRightCell
//   } = grabAllAdjacentCells(cells, rowParam, colParam);
  
//   if (topLeftCell && topLeftCell.state !== CellState.open &&
//      topLeftCell.value !== CellValue.bomb) {
//       if (topLeftCell.value === CellValue.none) {
//         newCells = openMultipleCells(newCells, rowParam-1, colParam-1);
//       } else {
//         newCells[rowParam-1][colParam-1].state = CellState.visible;
//       }
//   } // outer if-statement for topLeftCell
//   if (topCell && topCell.state !== CellState.open &&
//     topCell.value !== CellValue.bomb) {
//       if (topCell.value === CellValue.none) {
//         newCells = openMultipleCells(newCells, rowParam-1, colParam);
//       } else {
//         newCells[rowParam-1][colParam].state = CellState.visible;
//       }
//   } // outer if-statement for topCell
//   if (topRightCell && topRightCell.state !== CellState.open &&
//     topRightCell.value !== CellValue.bomb) {
//       if (topRightCell.value === CellValue.none) {
//         newCells = openMultipleCells(newCells, rowParam-1, colParam+1);
//       } else {
//         newCells[rowParam-1][colParam+1].state = CellState.visible;
//       }
//   } // outer if-statement for topRightCell
//   if (leftCell && leftCell.state !== CellState.open &&
//     leftCell.value !== CellValue.bomb) {
//       if (leftCell.value === CellValue.none) {
//         newCells = openMultipleCells(newCells, rowParam, colParam-1);
//       } else {
//         newCells[rowParam][colParam-1].state = CellState.visible;
//       }
//   } // outer if-statement for leftCell
//   if (rightCell && rightCell.state !== CellState.open &&
//     rightCell.value !== CellValue.bomb) {
//       if (rightCell.value === CellValue.none) {
//         newCells = openMultipleCells(newCells, rowParam, colParam+1);
//       } else {
//         newCells[rowParam][colParam+1].state = CellState.visible;
//       }
//   } // outer if-statement for rightCell
//   if (bottomLeftCell && bottomLeftCell.state !== CellState.open &&
//       bottomLeftCell.value !== CellValue.bomb) {
//       if (bottomLeftCell.value === CellValue.none) {
//         newCells = openMultipleCells(newCells, rowParam+1, colParam-1);
//       } else {
//         newCells[rowParam+1][colParam-1].state = CellState.visible;
//       }
//   } // outer if-statement for bottomLeftCell
//   if (bottomCell && bottomCell.state !== CellState.open &&
//     bottomCell.value !== CellValue.bomb) {
//       if (bottomCell.value === CellValue.none) {
//         newCells = openMultipleCells(newCells, rowParam+1, colParam);
//       } else {
//         newCells[rowParam+1][colParam].state = CellState.visible;
//       }
//   } // outer if-statement for bottomCell
//   if (bottomRightCell && bottomRightCell.state !== CellState.open &&
//     bottomRightCell.value !== CellValue.bomb) {
//       if (bottomRightCell.value === CellValue.none) {
//         newCells = openMultipleCells(newCells, rowParam+1, colParam+1);
//       } else {
//         newCells[rowParam+1][colParam+1].state = CellState.visible;
//       }
//   } // outer if-statement for bottomRightCell
//   return newCells;

// }; // <!---------------------------------- close ------- openMultipleCells()