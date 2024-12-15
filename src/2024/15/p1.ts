/**
 * https://adventofcode.com/2024/day/15
 *
 * General solution:
 * If robot hits a box, start a stack with that box.
 * Keep looking in the direction the robot would push the box...
 * if another box is found, add it to the stack.
 * if a wall is found, no boxes in the stack can move.
 * if an empty space is found, all boxes in the stack can move.
 */

import AOCBase from "../../AOCBase";

type Point = {x: number, y: number};
type Robot = Point;
type Dir = '<' | '>' | '^' | 'v';
type MapCell = '.' | '#' | 'O';
type Map = MapCell[][];

export default class Solution implements AOCBase {
  readonly sampleInput = `##########
#..O..O.O#
#......O.#
#.OO..O.O#
#..O@..O.#
#O#..O...#
#O..O..O.#
#.OO.O.OO#
#....O...#
##########

<vv>^<v^>v>^vv^v>v<>v^v<v<^vv<<<^><<><>>v<vvv<>^v^>^<<<><<v<<<v^vv^v>^
vvv<<^>^v^^><<>>><>^<<><^vv^^<>vvv<>><^^v>^>vv<>v<<<<v<^v>^<^^>>>^<v<v
><>vv>v^v^<>><>>>><^^>vv>v<^^^>>v^v^<^^>v^^>v^<^v>v<>>v^v^<v>v^^<^^vv<
<<v<^>>^^^^>>>v^<>vvv^><v<<<>^^^vv^<vvv>^>v<^^^^v<>^>vvvv><>>v^<<^^^^^
^><^><>>><>^^<<^^v>>><^<v>^<vv>>v>>>^v><>^v><<<<v>>v<v<v>vvv>^<><<>^><
^>><>^v<><^vvv<^^<><v<<<<<><^v<<<><<<^^<v<^^^><^>>^<v^><<<^>>^v<v^v<v^
>^>>^v>vv>^<<^v<>><<><<v<<v><>v<^vv<<<>^^v^>^^>>><<^v>>v^v><^^>>^<>vv^
<><^^>^^^<><vvvvv^v<v<<>^v<v>v<<^><<><<><<<^^<<<^<<>><<><^^^>^^<>^>v<>
^^>vv<^v^v<vv>^<><v<^v>^^^>>>^^vvv^>vvv<>>>^<^>>>>>^<<^v>^vvv<>^<><<v>
v^^>>><<^^<>>^v^<v^vv<>v^<<>^<^v^v><^<<<><<^<v><v<>vv>>v><v^<vv<>v^<<^`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    const robot: Robot = {x:0 , y:0};
    const [mapInput, directionsInput] = input.split('\n\n');
    const map = mapInput.split('\n').map((line, row) => line.split('').map((cell, col) => {
      if (cell === '@') {
        robot.x = col;
        robot.y = row;
        return '.';
      }
      return cell;
    })) as Map;
    const directions = directionsInput.replaceAll("\n", "").split('') as Dir[];

    return {robot, map, directions};
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const {robot, map, directions} = this.parseInput(input);

    for (const dir of directions) {
      move(robot, map, dir);
    }
    
    const result = calculateGPS(map);

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

function move(robot: Robot, map: Map, dir: Dir) {
  const {x, y} = getNewPosition(robot, dir);
  const desiredCellValue = map[y][x];

  // nothing in the way, just move
  if (desiredCellValue === '.') {
    robot.x = x;
    robot.y = y;
  // it's a wall, don't move
  } else if (desiredCellValue === '#') {
    return;
  // it's a box, see if it's moveable
  } else if (desiredCellValue === 'O') {
    moveBoxes(robot, {x, y}, map, dir);
  }
}

function getNewPosition({x, y}: Point, dir: Dir) {
  switch (dir) {
    case '<':
      x--;
      break;
    case '>':
      x++;
      break;
    case '^':
      y--;
      break;
    case 'v':
      y++;
      break;
  }

  return {x, y};
}

function moveBoxes(robot: Robot, boxPosition: Point, map: Map, dir: Dir) {
  const stack = [boxPosition];

  let canMove = false;
  let current = {x: boxPosition.x, y: boxPosition.y};

  while (true) {
    const {x, y} = getNewPosition(current, dir);
    const nextCellValue = map[y][x];

    switch (nextCellValue) {
      // can't move the boxes
      case '#':
        return;
      case '.':
        canMove = true;
        stack.push({x, y});
        break;
      case 'O':
        stack.push({x, y});
        break;
    }

    current = {x, y};

    if (canMove) {
      break;
    }
  }

  if (canMove) {
    while (stack.length) {
      const {x, y} = stack.pop()!;
      map[y][x] = stack.length > 0 ? 'O' : '.';
    }
    robot.x = boxPosition.x;
    robot.y = boxPosition.y;
  }
}

function calculateGPS(map: Map) {
  let sum = 0;
  for (let y = 1; y < map.length-1; y++) {
    for (let x = 1; x < map[0].length-1; x++) {
      if (map[y][x] === 'O') {
        sum += (100 * y) + x;
      }
    }
  }

  return sum;
}
