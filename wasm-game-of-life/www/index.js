import * as gol from "wasm-game-of-life";
import * as wasm from 'wasm-game-of-life/wasm_game_of_life_bg.wasm';

// -- use html <pre></pre>
// const pre = document.getElementById("game-of-life-canvas");
// const universe = wasm.Universe.new();
// const renderLoop = () => {
//     pre.textContent = universe.render();
//     universe.tick();

//     requestAnimationFrame(renderLoop);
// };
// requestAnimationFrame(renderLoop);
// -- END use html <pre></pre>

// -- use canvas
const CELL_SIZE = 5; // px
const GRID_COLOR = "#CCCCCC";
const DEAD_COLOR = "#FFFFFF";
const ALIVE_COLOR = "#000000";
// Construct the universe, and get its width and height.
const universe = gol.Universe.new();
const width = universe.width();
const height = universe.height();

// Give the canvas room for all of our cells and a 1px border
// around each of them.
const canvas = document.getElementById("game-of-life-canvas");
canvas.height = (CELL_SIZE + 1) * height + 1;
canvas.width = (CELL_SIZE + 1) * width + 1;

const ctx = canvas.getContext('2d');

const renderLoop = () => {
    universe.tick();

    drawGrid();
    drawCells();

    requestAnimationFrame(renderLoop);
};

const drawGrid = () => {
    ctx.beginPath();
    ctx.strokeStyle = GRID_COLOR;

    // Vertical lines.
    for (let i = 0; i <= width; i++) {
        ctx.moveTo(i * (CELL_SIZE + 1) + 1, 0);
        ctx.lineTo(i * (CELL_SIZE + 1) + 1, (CELL_SIZE + 1) * height + 1);
    }

    // Horizontal lines.
    for (let j = 0; j <= height; j++) {
        ctx.moveTo(0, j * (CELL_SIZE + 1) + 1);
        ctx.lineTo((CELL_SIZE + 1) * width + 1, j * (CELL_SIZE + 1) + 1);
    }

    ctx.stroke();
};

const getIndex = (row, column) => {
    return row * width + column;
};

const drawCells = () => {
    const cellsPtr = universe.cells();
    const cells = new Uint8Array(wasm.memory.buffer, cellsPtr, width * height);

    ctx.beginPath();

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const idx = getIndex(row, col);

            ctx.fillStyle = cells[idx] === gol.Cell.Dead
                ? DEAD_COLOR
                : ALIVE_COLOR;

            ctx.fillRect(
                col * (CELL_SIZE + 1) + 1,
                row * (CELL_SIZE + 1) + 1,
                CELL_SIZE,
                CELL_SIZE
            );
        }
    }

    ctx.stroke();
};

drawGrid();
drawCells();
requestAnimationFrame(renderLoop);

// -- END use canvas

//wasm.greet("huangbucheng");

//function fib(i) {
//    if (i === 0) return 0;
//    if (i === 1) return 1;
//    return fib(i - 1) + fib(i - 2);
//}
//
//console.time('js');
//console.log(fib(45));
//console.timeEnd('js');
//
//console.time('wasm');
//console.log(wasm.fib(45));
//console.timeEnd('wasm');
//