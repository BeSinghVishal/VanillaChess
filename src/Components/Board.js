import { useEffect, useState } from "react";
import {
  faChessBishop,
  faChessRook,
  faChessKnight,
  faChessQueen,
  faChessKing,
  faChessPawn,
  faSquare
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Highlighter } from "../Functions/activate";
import "../Css/Chess.css";
import Validator from "../Functions/isvalid";

const Board = () => {
  const [boardState, setBoardState] = useState([]); //holding current state of the board in form of the matrix
  const [selector, setSelector] = useState({ occupied: false, x: "", y: "" }); // for setting initial starting position
  const [isReverseVis, setIsReverseVis] = useState(false);
  const [playerKills, setPlayerkills] = useState({
    whiteKill: [],
    BlackKill: []
  });
  //const istrue = Validator(1, 2, "pawn");

  let ReverseBoardMatrix;
  let board_matrix;
  if (boardState.length != 0) {
    board_matrix = boardState;
    // console.log(JSON.parse(JSON.stringify(boardState)).reverse());
    ReverseBoardMatrix = JSON.parse(JSON.stringify(boardState)).reverse();
    ReverseBoardMatrix = ReverseBoardMatrix.map((row) =>
      JSON.parse(JSON.stringify(row)).reverse()
    );
  }

  const peices = {
    bishop: faChessBishop,
    rook: faChessRook,
    knight: faChessKnight,
    queen: faChessQueen,
    king: faChessKing,
    pawn: faChessPawn,
    empty: faSquare
  };
  //initial peice position marker
  const initial_pos = {
    0: peices.rook,
    1: peices.knight,
    2: peices.bishop,
    3: peices.queen,
    4: peices.king,
    5: peices.bishop,
    6: peices.knight,
    7: peices.rook
  };
  //Chess-Matrix
  useEffect(() => {
    let board_matrix = [[], [], [], [], [], [], [], []];

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        let obj = {};
        let peice = peices.empty;
        let peice_color = "";

        if (i === 1 || i === 6) {
          peice = peices.pawn;
          if (i === 1) peice_color = "bl";
          else peice_color = "wt";
        }
        if (i === 0 || i === 7) {
          peice = initial_pos[j];
          if (i === 0) peice_color = "bl";
          else peice_color = "wt";
        }
        if ((i + 1) % 2 !== 0) {
          if ((j + 1) % 2 !== 0) {
            obj = {
              cell: { color: "w", posx: i, posy: j },
              peiceProp: { peice, peice_color }
            };
            board_matrix[i].push(obj);
          } else {
            obj = {
              cell: { color: "b", posx: i, posy: j },
              peiceProp: { peice, peice_color }
            };
            board_matrix[i].push(obj);
          }
        } else {
          if ((j + 1) % 2 !== 0) {
            obj = {
              cell: { color: "b", posx: i, posy: j },
              peiceProp: { peice, peice_color }
            };
            board_matrix[i].push(obj);
          } else {
            obj = {
              cell: { color: "w", posx: i, posy: j },
              peiceProp: { peice, peice_color }
            };
            board_matrix[i].push(obj);
          }
        }
      }
    }
    setBoardState(board_matrix);
  }, []);

  const hndlr = (event) => {
    Highlighter(event.currentTarget); //highlighting current selected block
    let y = event.currentTarget.id % 10; //extracting X,Y co-ordinates of the selected block
    let x = (event.currentTarget.id - y) / 10;

    if (
      selector.occupied === false &&
      board_matrix[x][y].peiceProp.peice !== peices.empty
    ) {
      setSelector({ ...selector, occupied: true, x, y }); // setting initial starting position for the move.
    }
    if (selector.occupied === true) {
      //condition when initial starting postion is already set .
      if (board_matrix[x][y].peiceProp.peice === peices.empty) {
        // condition if destination is an empty block.
        let temp = board_matrix[x][y];
        board_matrix[x][y] = {
          ...board_matrix[x][y],
          peiceProp: board_matrix[selector.x][selector.y].peiceProp
        };
        board_matrix[selector.x][selector.y] = {
          ...board_matrix[selector.x][selector.y],
          peiceProp: temp.peiceProp
        };
        setBoardState([...board_matrix]);
      } else if (
        (x !== selector.x || y !== selector.y) &&
        board_matrix[x][y].peiceProp.peice_color !==
          board_matrix[selector.x][selector.y].peiceProp.peice_color
      ) {
        // condtion if destination is not an empty block as well as the initial position itself.
        console.log("cordinates are", x, y);
        let temp = board_matrix[x][y];
        board_matrix[x][y] = {
          ...board_matrix[x][y],
          peiceProp: board_matrix[selector.x][selector.y].peiceProp
        };
        board_matrix[selector.x][selector.y] = {
          ...board_matrix[selector.x][selector.y],
          peiceProp: { peice: peices.empty, peice_color: "" }
        };
        setBoardState([...board_matrix]);
        temp.peiceProp.peice_color === "bl"
          ? setPlayerkills({
              ...playerKills,
              whiteKill: [...playerKills.whiteKill, temp.peiceProp.peice]
            })
          : setPlayerkills({
              ...playerKills,
              BlackKill: [...playerKills.BlackKill, temp.peiceProp.peice]
            });
      }
    }
  };

  //function for displaying single chess box unit
  const box = (color_class, peice, peice_color, pos) => {
    return (
      <div className={[color_class, "box"].join(" ")} id={pos} onClick={hndlr}>
        <div className={[peice_color, "icon"].join(" ")}>
          {peice.iconName !== peices.empty.iconName ? (
            <FontAwesomeIcon icon={peice} size="4x" />
          ) : (
            <span id={color_class}>
              <FontAwesomeIcon icon={peice} size="4x" />
            </span>
          )}
        </div>
      </div>
    );
  };

  useEffect(() => {
    //for re-setting initial-starting  position to null after a move is completed
    if (selector.occupied != false) {
      setSelector({ ...selector, occupied: false, x: "", y: "" }); //caution don't touch hook dependency '[boardState]'
    }
  }, [boardState]);

  const toggleView = () => {
    //to change inbetween perspective of both the players
    setIsReverseVis((state) => !state);
  };

  const boardDisplay = (matrix) => {
    //function to display board using matrix of the game.
    return (
      <div className="holder">
        {matrix &&
          matrix.map((row) => {
            let sub_arr;
            sub_arr = row.map((box_attr) => {
              return box(
                box_attr.cell.color,
                box_attr.peiceProp.peice,
                box_attr.peiceProp.peice_color,
                box_attr.cell.posx * 10 + box_attr.cell.posy
              );
            });
            return <div className="inner">{sub_arr}</div>;
          })}
      </div>
    );
  };
  const displayKill = (kill) => {
    // console.log(kill);
    return (
      <span className="kill">
        <FontAwesomeIcon icon={kill} size="2x" />
      </span>
    );
  };

  return (
    <div>
      {!isReverseVis && boardDisplay(boardState)}
      {isReverseVis && boardDisplay(ReverseBoardMatrix)}
      <div className="killContainer">
        <div className="killArea" id="black">
          <span className="ttle">White's Kills</span>
          {playerKills.whiteKill.map((kill) => {
            console.log(kill);
            return displayKill(kill);
          })}
        </div>
        <div className="killArea" id="white">
          <span className="ttle">Black's Kills</span>
          {playerKills.BlackKill.map((kill) => {
            return displayKill(kill);
          })}
        </div>
        <button onClick={toggleView}> Toggle View </button>
      </div>
    </div>
  );
};
export default Board;
