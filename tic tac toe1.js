// DOM Selectors
let boxes = document.querySelectorAll(".box");
let resetBtn = document.querySelector("#reset-btn");
let newGameBtn = document.querySelector("#new-btn");
let msgContainer = document.querySelector(".msg-container");
let msg = document.querySelector("#msg");
let aiBtn = document.getElementById("ai-btn");
let humanBtn = document.getElementById("human-btn");

let isGameOver = false;
let isAiTurn = false;
let board = ["", "", "", "", "", "", "", "", ""];
let player = "X";
let ai = "O";

// Winning combinations
const winPatterns = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// --------- Player Selection ---------
aiBtn.addEventListener("click", () => {
  resetGame();
  isAiTurn = true;
  disableChoiceButtons();
  computerMove(); // AI starts with best move
});

humanBtn.addEventListener("click", () => {
  resetGame();
  isAiTurn = false;
  disableChoiceButtons();
});

// Disable buttons and hide selection UI
function disableChoiceButtons() {
  aiBtn.disabled = true;
  humanBtn.disabled = true;
  document.querySelector(".list").style.display = "none";
}

// --------- Game Core ---------

// Check winner or draw
const checkWinner = (brd) => {
  for (let pattern of winPatterns) {
    const [a, b, c] = pattern;
    if (brd[a] && brd[a] === brd[b] && brd[b] === brd[c]) {
      return brd[a];
    }
  }
  if (!brd.includes("")) return "draw";
  return null;
};

// Show Winner
const showWinner = (winner) => {
  msg.innerText = winner === "draw" ? "Match Drawn!" : `${winner} won!`;
  msgContainer.classList.remove("hide");
  isGameOver = true;
  disableBoxes();
};

// Disable All Boxes
const disableBoxes = () => {
  boxes.forEach((box) => (box.disabled = true));
};

// Enable All Boxes for New Game
const enableBoxes = () => {
  boxes.forEach((box) => {
    box.disabled = false;
    box.innerText = "";
  });
  board = ["", "", "", "", "", "", "", "", ""];
};

// AI Move (Minimax)
const computerMove = () => {
  if (isGameOver) return;

  let bestScore = -Infinity;
  let move = -1;

  for (let i = 0; i < 9; i++) {
    if (board[i] === "") {
      board[i] = ai;
      let score = minimax(board, false);
      board[i] = "";
      if (score > bestScore) {
        bestScore = score;
        move = i;
      }
    }
  }

  if (move !== -1) {
    board[move] = ai;
    boxes[move].innerText = ai;
    boxes[move].disabled = true;

    let result = checkWinner(board);
    if (result) showWinner(result);
  }
};

// Minimax Algorithm
const minimax = (brd, isMaximizing) => {
  let result = checkWinner(brd);
  if (result === ai) return 1;
  if (result === player) return -1;
  if (result === "draw") return 0;

  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let i = 0; i < 9; i++) {
      if (brd[i] === "") {
        brd[i] = ai;
        let score = minimax(brd, false);
        brd[i] = "";
        bestScore = Math.max(score, bestScore);
      }
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let i = 0; i < 9; i++) {
      if (brd[i] === "") {
        brd[i] = player;
        let score = minimax(brd, true);
        brd[i] = "";
        bestScore = Math.min(score, bestScore);
      }
    }
    return bestScore;
  }
};

// --------- Box Click Handling ---------
boxes.forEach((box, index) => {
  box.addEventListener("click", () => {
    if (box.innerText === "" && !isGameOver) {
      box.innerText = player;
      board[index] = player;
      box.disabled = true;

      let result = checkWinner(board);
      if (result) {
        showWinner(result);
      } else {
        setTimeout(computerMove, 300);
      }
    }
  });
});

// --------- Reset Game ---------
const resetGame = () => {
  enableBoxes();
  msgContainer.classList.add("hide");
  isGameOver = false;
};

// Reset and New Game Buttons
resetBtn.addEventListener("click", () => {
  resetGame();
  location.reload(); // Reload to allow re-choosing who plays first
});

newGameBtn.addEventListener("click", () => {
  resetGame();
  location.reload();
});
