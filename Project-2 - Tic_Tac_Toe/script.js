const board = document.getElementById("board");
const status = document.getElementById("status");
let currentPlayer = "X";
let cells = Array(9).fill("");

function checkWinner() {
  const wins = [
    [0,1,2],[3,4,5],[6,7,8],
    [0,3,6],[1,4,7],[2,5,8],
    [0,4,8],[2,4,6]
  ];
  for (let [a,b,c] of wins)
    if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c])
      return cells[a];
  return cells.includes("") ? null : "Draw";
}

function handleClick(i, el) {
  if (cells[i] || checkWinner()) return;
  cells[i] = currentPlayer;
  el.textContent = currentPlayer;
  el.style.color = currentPlayer === "X" ? "#d63031" : "#0984e3";
  let result = checkWinner();
  if (result) {
    showAlert(result === "Draw" ? "It's a draw!" : `${result} wins!`);
    board.querySelectorAll("div").forEach(cell => cell.style.pointerEvents = "none");
  }
  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

function renderBoard() {
  board.innerHTML = "";
  cells.forEach((_, i) => {
    let cell = document.createElement("div");
    cell.addEventListener("click", () => handleClick(i, cell));
    board.appendChild(cell);
  });
}

function resetGame() {
  cells = Array(9).fill("");
  currentPlayer = "X";
  status.textContent = "";
  renderBoard();
}

function showAlert(message) {
  const alertBox = document.getElementById("alert");
  alertBox.textContent = message;
  alertBox.classList.add("show");
  setTimeout(() => {
    alertBox.classList.remove("show");
  }, 2000);
}

renderBoard();
