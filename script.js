const grid = document.getElementById('grid');
const turnsDisplay = document.getElementById('turns');
const restartBtn = document.getElementById('restart-btn');

let board = [1, 2, 3, 4, 5, 6, 7, 8, ""]; // 最後の要素が空白
let turns = 0;
let isWon = false;

// シャッフルして解ける状態のパズルを作る
function shuffleBoard() {
    // 実際にシャッフルを繰り返してランダムな盤面を作る（必ずクリアできる手順にするためランダム移動）
    for (let i = 0; i < 100; i++) {
        let emptyIdx = board.indexOf("");
        let validMoves = [];
        
        let row = Math.floor(emptyIdx / 3);
        let col = emptyIdx % 3;

        if (row > 0) validMoves.push(emptyIdx - 3); // 上
        if (row < 2) validMoves.push(emptyIdx + 3); // 下
        if (col > 0) validMoves.push(emptyIdx - 1); // 左
        if (col < 2) validMoves.push(emptyIdx + 1); // 右

        let randomMove = validMoves[Math.floor(Math.random() * validMoves.length)];
        
        // 入れ替え
        board[emptyIdx] = board[randomMove];
        board[randomMove] = "";
    }
    
    // 万が一最初からクリア状態になっていたらもう一度シャッフル
    if (checkWinCondition()) {
        shuffleBoard();
    }
}

// 画面にパズルを描画する
function renderBoard() {
    grid.innerHTML = '';
    board.forEach((value, index) => {
        const tile = document.createElement('div');
        tile.classList.add('tile');
        if (value === "") {
            tile.classList.add('empty');
        } else {
            tile.textContent = value;
            // パネルを直接タップして動かせる機能
            tile.addEventListener('click', () => moveTile(index));
        }
        grid.appendChild(tile);
    });
}

// タップまたは矢印キーでパネルを動かす処理
function moveTile(index) {
    if (isWon) return;

    let emptyIdx = board.indexOf("");
    
    let tRow = Math.floor(index / 3);
    let tCol = index % 3;
    let eRow = Math.floor(emptyIdx / 3);
    let eCol = emptyIdx % 3;

    // タップしたパネルが空白の隣（上下左右）にあるか判定
    let isAdjacent = (Math.abs(tRow - eRow) + Math.abs(tCol - eCol) === 1);

    if (isAdjacent) {
        board[emptyIdx] = board[index];
        board[index] = "";
        turns++;
        turnsDisplay.textContent = turns;
        renderBoard();

        if (checkWinCondition()) {
            isWon = true;
            setTimeout(() => {
                alert(`🎉 おめでとうございます！ ${turns}手でクリアしました！`);
            }, 150);
        }
    }
}

// 矢印ボタンでの操作（空白の逆方向に動かす、または空白をその方向にスライドさせる）
function handleDirection(direction) {
    if (isWon) return;
    let emptyIdx = board.indexOf("");
    let targetIdx = -1;

    let row = Math.floor(emptyIdx / 3);
    let col = emptyIdx % 3;

    // 矢印の方向に合わせて空白と入れ替えるパネルを決める
    // 例: 「⬆️」を押したときは、空白の下にあるパネルを持ち上げる（空白と下のパネルを入れ替える）
    if (direction === 'up' && row < 2) targetIdx = emptyIdx + 3;
    if (direction === 'down' && row > 0) targetIdx = emptyIdx - 3;
    if (direction === 'left' && col < 2) targetIdx = emptyIdx + 1;
    if (direction === 'right' && col > 0) targetIdx = emptyIdx - 1;

    if (targetIdx !== -1) {
        board[emptyIdx] = board[targetIdx];
        board[targetIdx] = "";
        turns++;
        turnsDisplay.textContent = turns;
        renderBoard();

        if (checkWinCondition()) {
            isWon = true;
            setTimeout(() => {
                alert(`🎉 おめでとうございます！ ${turns}手でクリアしました！`);
            }, 150);
        }
    }
}

// クリア判定 (1, 2, 3, 4, 5, 6, 7, 8, "")
function checkWinCondition() {
    const winningState = [1, 2, 3, 4, 5, 6, 7, 8, ""];
    return board.every((val, i) => val === winningState[i]);
}

// 初期化スタート
function initGame() {
    turns = 0;
    turnsDisplay.textContent = turns;
    isWon = false;
    shuffleBoard();
    renderBoard();
}

// スマホ用ボタンのイベント
document.getElementById('btn-up').addEventListener('pointerdown', (e) => { e.preventDefault(); handleDirection('up'); });
document.getElementById('btn-down').addEventListener('pointerdown', (e) => { e.preventDefault(); handleDirection('down'); });
document.getElementById('btn-left').addEventListener('pointerdown', (e) => { e.preventDefault(); handleDirection('left'); });
document.getElementById('btn-right').addEventListener('pointerdown', (e) => { e.preventDefault(); handleDirection('right'); });

// キーボード操作の対応 (PC用)
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp': handleDirection('up'); break;
        case 'ArrowDown': handleDirection('down'); break;
        case 'ArrowLeft': handleDirection('left'); break;
        case 'ArrowRight': handleDirection('right'); break;
    }
});

restartBtn.addEventListener('click', initGame);

// ゲーム開始
initGame();
