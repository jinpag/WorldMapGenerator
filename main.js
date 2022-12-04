// 引用になりますが作成ルールは下記
// 1:任意の割合でチップをランダムに配置する
// 2:隣接色のいずれかにランダムチェンジ
// 3:隣接色がすべて同じ色だったら浸食
// 4:2〜３を繰り返す

const WIDTH = 200;
const HEIGHT = 200;
const SIZE = 3;

const Chip = Object.freeze({
  SEA: 0,
  PLAIN: 1,
  GRASS: 2,
  DIRT: 3,
  DESERT: 4,
  SNOW: 5,
  MAX: 6
});

const ChipColor = ["#00f", "#0ff", "#0f0", "#f00", "#ff0", "#fff", ""];

let ctx = null;

let map = [];
let gene = 1;

// 1:任意の割合でチップをランダムに配置する
// ★本当は海の割合とか指定できた方がそれっぽくなりそう
const reset_map = () => {
  gene = 1;
  for (let y = 0; y < HEIGHT; y++) {
    map[y] = [];
    for (let x = 0; x < WIDTH; x++) {
      // 外周は海固定にする
      if (x === 0 || y === 0 || x === WIDTH - 1 || y === HEIGHT - 1) {
        map[y][x] = Chip.SEA;
      } else {
        map[y][x] = Math.trunc(Math.random() * Chip.MAX);
      }
    }
  }
};

// 2:隣接色のいずれかにランダムチェンジ
// 3:隣接色がすべて同じ色だったら浸食
const update_map = () => {
  const dirs = [
    [0, -1],
    [-1, 0],
    [1, 0],
    [0, 1]
  ];

  for (let y = 1; y < HEIGHT - 1; y++) {
    for (let x = 1; x < WIDTH - 1; x++) {
      // 2:隣接色のいずれかにランダムチェンジ
      const d = Math.trunc(Math.random() * dirs.length);
      const [dx, dy] = dirs[d];
      map[y][x] = map[y + dy][x + dx];

      // 3:隣接色がすべて同じ色だったら浸食
      let is_same = true;
      let c0 = -1;
      for (let i = 0; i < 4; i++) {
        const [dx, dy] = dirs[i];
        const c = map[y + dy][x + dx];
        if (c0 === -1) {
          c0 = c;
        } else if (c0 !== c) {
          is_same = false;
          break;
        }
      }
      if (is_same) {
        map[y][x] = c0;
      }
    }
  }

  // 世代を更新
  gene++;

  document.getElementById("gene").textContent = `第${gene}世代`;
};

const render = () => {
  for (let y = 0; y < HEIGHT; y++) {
    for (let x = 0; x < WIDTH; x++) {
      const c = map[y][x];
      ctx.fillStyle = ChipColor[c];
      ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE);
    }
  }
};

const init = () => {
  const canvas = document.getElementById("canvas");
  ctx = canvas.getContext("2d");
  canvas.width = WIDTH * SIZE;
  canvas.height = HEIGHT * SIZE;

  document.getElementById("reset").onclick = () => {
    reset_map();
    render();
  };

  document.getElementById("repeat").onclick = () => {
    update_map();
    render();
  };
};

window.onload = () => {
  init();
  reset_map();
  render();

  const tick = () => {
    setTimeout(tick, 500);
    update_map();
    render();
  };
  tick();
};
