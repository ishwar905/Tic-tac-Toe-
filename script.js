let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let isAI = false;
let player1Emoji = "❌";
let player2Emoji = "⭕";

function startGame(mode) {
    isAI = mode === "ai";
    board = ["", "", "", "", "", "", "", "", ""];
    currentPlayer = "X";
    document.querySelectorAll(".cell").forEach(cell => cell.innerText = "");
    
    player1Emoji = document.getElementById("player1Emoji").value || "❌";
    player2Emoji = document.getElementById("player2Emoji").value || "⭕";
}

function makeMove(index) {
    if (board[index] || checkWinner()) return;

    playSound("clickSound");
    board[index] = currentPlayer;
    document.querySelectorAll(".cell")[index].innerText = currentPlayer === "X" ? player1Emoji : player2Emoji;

    if (checkWinner()) {
        playSound("winSound");
        showPopup(`${currentPlayer === "X" ? player1Emoji : player2Emoji} Wins!`);
        return;
    }

    if (board.every(cell => cell)) {
        showPopup("It's a Draw!");
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";

    if (isAI && currentPlayer === "O") {
        setTimeout(aiMove, 500);
    }
}

function aiMove() {
    let bestMove = minimax(board, "O").index;
    makeMove(bestMove);
}

function minimax(newBoard, player) {
    let emptyCells = newBoard.map((cell, index) => cell === "" ? index : null).filter(index => index !== null);
    
    if (checkWinnerForAI(newBoard, "X")) return { score: -10 };
    if (checkWinnerForAI(newBoard, "O")) return { score: 10 };
    if (emptyCells.length === 0) return { score: 0 };

    let moves = [];
    for (let i = 0; i < emptyCells.length; i++) {
        let move = {};
        move.index = emptyCells[i];
        newBoard[emptyCells[i]] = player;

        move.score = player === "O" ? minimax(newBoard, "X").score : minimax(newBoard, "O").score;
        newBoard[emptyCells[i]] = "";

        moves.push(move);
    }

    let bestMove = moves.reduce((best, move) => 
        (player === "O" ? move.score > best.score : move.score < best.score) ? move : best, 
        { score: player === "O" ? -Infinity : Infinity });

    return bestMove;
}

function checkWinner() {
    return checkWinnerForAI(board, "X") || checkWinnerForAI(board, "O");
}

function checkWinnerForAI(boardState, player) {
    const winPatterns = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]
    ];

    return winPatterns.some(pattern => 
        pattern.every(index => boardState[index] === player));
}

function showPopup(message) {
    document.getElementById("popup-message").innerText = message;
    document.getElementById("popup").style.display = "block";
}

function resetGame() {
    document.getElementById("popup").style.display = "none";
    startGame(isAI ? "ai" : "pvp");
}

function playSound(soundId) {
    document.getElementById(soundId).play();
}
