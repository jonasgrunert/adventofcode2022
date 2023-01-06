import Solution from "./solution.ts";

type Coords = Array<boolean | undefined>[];
type Directions = Array<number | string>;

const dirRegex = /(\d+|R|L)/g;

const moves = [
  [1, 0],
  [0, 1],
  [-1, 0],
  [0, -1],
];

function walk(grid: Coords, instructions: Directions) {
  const curr = { y: 0, x: grid[0].findIndex((e) => e === true), d: 0 };
  for (const inst of instructions) {
    if (typeof inst === "string") {
      curr.d = mod(inst === "R" ? curr.d + 1 : curr.d - 1, moves.length);
    } else {
      for (let i = 0; i < inst; i++) {
        if (curr.d === 0) {
          const next =
            grid[curr.y][curr.x + 1] === undefined
              ? grid[curr.y].findIndex((e) => e !== undefined)
              : curr.x + 1;
          if (grid[curr.y][next]) {
            curr.x = next;
          } else {
            break;
          }
        } else if (curr.d === 1) {
          const next =
            grid[curr.y + 1]?.[curr.x] === undefined
              ? grid
                  .map((axis) => axis[curr.x])
                  .findIndex((e) => e !== undefined)
              : curr.y + 1;
          if (grid[next][curr.x]) {
            curr.y = next;
          } else {
            break;
          }
        } else if (curr.d === 2) {
          const next =
            grid[curr.y][curr.x - 1] === undefined
              ? grid[curr.y].findLastIndex((e) => e !== undefined)
              : curr.x - 1;
          if (grid[curr.y][next]) {
            curr.x = next;
          } else {
            break;
          }
        } else if (curr.d === 3) {
          const next =
            grid[curr.y - 1]?.[curr.x] === undefined
              ? grid
                  .map((axis) => axis[curr.x])
                  .findLastIndex((e) => e !== undefined)
              : curr.y - 1;
          if (grid[next][curr.x]) {
            curr.y = next;
          } else {
            break;
          }
        }
      }
    }
  }
  return curr;
}

type Dir = "u" | "d" | "f" | "b" | "r" | "l";
type Face = {
  x: number;
  y: number;
  coords: Coords;
  name: Dir;
  neighbours: Dir[];
};
const cubeFaces = {
  u: ["r", "f", "l", "b"],
  r: ["u", "b", "d", "f"],
  f: ["u", "r", "d", "l"],
} as Record<Dir, Dir[]>;
cubeFaces.d = cubeFaces.u.toReversed();
cubeFaces.l = cubeFaces.r.toReversed();
cubeFaces.b = cubeFaces.f.toReversed();

function mod(n: number, m: number) {
  const x = n % m;
  return x < 0 ? x + m : x;
}

function fold(coords: Coords) {
  const size = Math.sqrt(
    coords.reduce(
      (p, c) => p + c.reduce((a, b) => a + (b !== undefined ? 1 : 0), 0),
      0,
    ) / 6,
  );
  const x = coords[0].findIndex((e) => e === true);
  const start: Face = {
    y: 0,
    x,
    coords: coords.slice(0, size).map((l) => l.slice(x, x + size)),
    name: "u",
    neighbours: cubeFaces["u"],
  };
  const faces = {} as Record<Dir, Face>;
  function walk(face: Face) {
    faces[face.name] = face;
    for (let i = 0; i < moves.length; i++) {
      const [dx, dy] = moves[i];
      const nX = face.x + dx * size;
      const nY = face.y + dy * size;
      const name = face.neighbours[i];
      if (coords[nY]?.[nX] !== undefined && faces[name] === undefined) {
        const ix = cubeFaces[name].indexOf(face.name);
        const r = (i + moves.length / 2) % moves.length;
        const nF = {
          y: nY,
          x: nX,
          coords: coords
            .slice(nY, nY + size)
            .map((l) => l.slice(nX, nX + size)),
          name,
          neighbours: cubeFaces[name].map(
            (_, j, all) => all[mod(ix - r + j, moves.length)],
          ),
        };
        walk(nF);
      }
    }
  }
  walk(start);
  return { faces, size };
}

function follow(
  faces: Record<Dir, Face>,
  instructions: Directions,
  size: number,
) {
  let curr = {
    x: 0,
    y: 0,
    d: 0,
    f: "u" as Dir,
  };
  for (const inst of instructions) {
    if (typeof inst === "string") {
      curr.d = mod(inst === "R" ? curr.d + 1 : curr.d - 1, moves.length);
    } else {
      for (let i = 0; i < inst; i++) {
        const [dx, dy] = moves[curr.d];
        let x = curr.x + dx;
        let y = curr.y + dy;
        let f = curr.f;
        let d = curr.d;
        if (x < 0 || y < 0 || size <= x || size <= y) {
          x = mod(x, size);
          y = mod(y, size);
          f = faces[f].neighbours[d];
          while (
            faces[f].neighbours[(d + moves.length / 2) % moves.length] !==
            curr.f
          ) {
            [x, y] = [size - 1 - y, x];
            d = (d + 1) % moves.length;
          }
        }
        if (!faces[f].coords[y][x]) {
          break;
        }
        curr = { x, y, d, f };
      }
    }
  }
  return curr;
}

const task = new Solution(
  (arr: Array<Coords | Directions>) => {
    const finish = walk(arr[0] as Coords, arr[1] as Directions);
    return 1000 * (finish.y + 1) + 4 * (finish.x + 1) + finish.d;
  },
  (arr: Array<Coords | Directions>) => {
    const { faces, size } = fold(arr[0] as Coords);
    const end = follow(faces, arr[1] as Directions, size);
    return (
      1000 * (end.y + faces[end.f].y + 1) +
      4 * (end.x + faces[end.f].x + 1) +
      end.d
    );
  },
  {
    transform: (e, i) => {
      if (i === 0) {
        return e
          .split("\n")
          .map((s) =>
            s
              .split("")
              .map((s) => ({ " ": undefined, ".": true, "#": false }[s])),
          );
      }
      return [...e.matchAll(dirRegex)].map((n, x) =>
        x % 2 == 0 ? Number.parseInt(n[1]) : n[1],
      );
    },
    sep: "\n\n",
  },
);
task.expect(6032, 5031);

if (import.meta.main) await task.execute();

export default task;
