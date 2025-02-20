import { useState } from 'react';


function OrderButton({ ascending, onButtonClick }) {
  return (
    <button onClick={onButtonClick}>
      {ascending ? (<>Descend</>) : (<>Ascend</>)}
    </button>
  );
}

function Square({ value, onSquareClick, winningSquare=false }) {
  return (
    <button className={winningSquare ? " square winning-square" : "square"} onClick={onSquareClick}>
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  function handleClick(i) {
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = 'X';
    } else {
      nextSquares[i] = 'O';
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner[0];
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

const boardLength = 3
  const boardRows = [...Array(boardLength).keys()].map((row) => {
      const boardSquares = [...Array(boardLength).keys()].map((col) => {
          const i = boardLength*row + col;
          return (
              <Square
              key={i}
              value={squares[i]}
              winningSquare={winner ? winner[1].includes(i) : false}
              onSquareClick={() => handleClick(i)}
              />
          )
      })
      return (
        
          <div key={row} className="board-row">{boardSquares}</div>
      )
  })

  return (
    <>
      <div className="status">{status}</div>
      {boardRows}
    </>
  );
}

// display:
/*
  Go to game start
  Go to move 1: (row, col)
  Go to move 2: (row, col)
*/
export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [ascending, setAscending] = useState(true);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function flipOrder() {
    setAscending(!ascending);
  }

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }

  function findMoveLocation(history, move) {
    // find the current move
    let row = 0, col = 0;
    for (let i = 0; i < 9; i++) {
      if (history[move][i] !== history[move - 1][i]) {
        // return when you find the location of the move
        return [row, col];
      } else {
        // update row, col
        col++;
        if (col > 2) {
          col = 0;
          row++;
        }
      }
    }
  }

  const moves = history.map((squares, move) => {
    let description;
    if (move > 0) {
      let [row, col] = findMoveLocation(history, move);
      description = 'Go to move #' + move + ' (' + row + ', ' + col + ')';
    } else {
      description = 'Go to game start';
    }
    return (
      <li key={move}>
        {move == currentMove ? (<>You are at move #{move}</>) : <button onClick={() => jumpTo(move)}>{description}</button>}
      </li>
    );
  });

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <ol>{ascending ? moves : moves.slice().reverse()}</ol>
      </div>
      <div>
        <OrderButton
          ascending={ascending} 
          onButtonClick={() => flipOrder()}
        />
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], lines[i]];
    }
  }
  return null;
}
