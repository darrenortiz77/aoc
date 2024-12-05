/**
 * https://adventofcode.com/2024/day/4
 *
 * General solution:
 * 1. Loop over each cell in the matrix
 * 2. If the cell's value equals the first letter of our search term, look in all directions for the next letter.
 * 3. If the next letter is found, keep searching in that direction until we find the whole word.
 */

import AOCBase from "../../AOCBase";

enum Dir {
  All,
  T,
  TR,
  R,
  BR,
  B,
  BL,
  L,
  TL
}

export default class Solution implements AOCBase {
  static readonly WORD = 'XMAS';
  private numFound = 0;

  readonly sampleInput = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input.split('\n').map(line => line.split(''));
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const matrix = this.parseInput(input);

    for (let row = 0; row <= matrix.length; row++) {
      for (let col = 0; col < matrix[0].length; col++) {
          this.checkCell(matrix, row, col, 0, Dir.All);
      }
    }

    return {
      performance: performance.now() - performanceStart, 
      result: this.numFound
    }
  }

  private checkCell(matrix: string[][], row: number, col: number, charIdx: number, dir: Dir) {
    if (
      row < 0 ||
      row >= matrix.length ||
      col < 0 ||
      col >= matrix[0].length
    ) {
      return;
    }

    const currentLetter = matrix[row][col];
    const targetLetter = Solution.WORD.charAt(charIdx);

    if (currentLetter === targetLetter) {
      if (charIdx === Solution.WORD.length-1) {
        this.numFound++;
        return;
      }

      const nextCharIdx = charIdx+1;

      if (dir === Dir.All || dir === Dir.T) this.checkCell(matrix, row-1, col, nextCharIdx, Dir.T);
      if (dir === Dir.All || dir === Dir.TR) this.checkCell(matrix, row-1, col+1, nextCharIdx, Dir.TR);
      if (dir === Dir.All || dir === Dir.R) this.checkCell(matrix, row, col+1, nextCharIdx, Dir.R);
      if (dir === Dir.All || dir === Dir.BR) this.checkCell(matrix, row+1, col+1, nextCharIdx, Dir.BR);
      if (dir === Dir.All || dir === Dir.B) this.checkCell(matrix, row+1, col, nextCharIdx, Dir.B);
      if (dir === Dir.All || dir === Dir.BL) this.checkCell(matrix, row+1, col-1, nextCharIdx, Dir.BL);
      if (dir === Dir.All || dir === Dir.L) this.checkCell(matrix, row, col-1, nextCharIdx, Dir.L);
      if (dir === Dir.All || dir === Dir.TL) this.checkCell(matrix, row-1, col-1, nextCharIdx, Dir.TL);
    }
  }
}
