/**
 * https://adventofcode.com/2024/day/4
 *
 * General solution:
 * 1. Loop over each cell in the matrix
 * 2. If the cell's value equals the first letter of our search term, look diagonally the next letter.
 * 3. If one of the letter's we've found equals the midpoint of the search term, remember that and pass it along to the rest of the search logic.
 * 4. If we find the entire word (MAS), check to see if we've already found another MAS that shares the same midpoint.
 * 5. If so, increment num found.
 * 6. Either way, remember that we found a midpoint.
 */

import CodeRunner from "../../CodeRunner";

enum Dir {
  All,
  TR,
  BR,
  BL,
  TL
}

export default class DayFourPartTwo extends CodeRunner {
  static readonly WORD = 'MAS';
  private numFound = 0;
  private midPoints = new Set<string>();

  public run(input?: string) {
    if (!input) {
      input = `MMMSXXMASM
MSAMXMSMSA
AMXSXMAAMM
MSAMASMSMX
XMASAMXAMM
XXAMMXXAMA
SMSMSASXSS
SAXAMASAAA
MAMMMXMMMM
MXMXAXMASX`;
    }
    
    const performanceStart = performance.now();

    const matrix = input.split('\n').map(line => line.split(''));

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

  private checkCell(matrix: string[][], row: number, col: number, charIdx: number, dir: Dir, midPtPos?: [number, number]) {
    if (
      row < 0 ||
      row >= matrix.length ||
      col < 0 ||
      col >= matrix[0].length
    ) {
      return;
    }

    const currentLetter = matrix[row][col];
    const targetLetter = DayFourPartTwo.WORD.charAt(charIdx);

    if (currentLetter === targetLetter) {
      if (charIdx === Math.floor(DayFourPartTwo.WORD.length/2)) {
        midPtPos = [row, col];
      } else if (charIdx === DayFourPartTwo.WORD.length-1) {
        this.checkIfValid(midPtPos!);
        return;
      }

      const nextCharIdx = charIdx+1;

      if (dir === Dir.All || dir === Dir.TR) this.checkCell(matrix, row-1, col+1, nextCharIdx, Dir.TR, midPtPos);
      if (dir === Dir.All || dir === Dir.BR) this.checkCell(matrix, row+1, col+1, nextCharIdx, Dir.BR, midPtPos);
      if (dir === Dir.All || dir === Dir.BL) this.checkCell(matrix, row+1, col-1, nextCharIdx, Dir.BL, midPtPos);
      if (dir === Dir.All || dir === Dir.TL) this.checkCell(matrix, row-1, col-1, nextCharIdx, Dir.TL, midPtPos);
    }
  }

  private checkIfValid(midPtPos: [number, number]) {
    if (this.midPoints.has(midPtPos.join('-'))) {
      this.numFound++;
    }

    this.midPoints.add(midPtPos.join('-'));
  }
}
