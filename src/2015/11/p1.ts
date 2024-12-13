/**
 * https://adventofcode.com/2015/day/11
 *
 * General solution:
 * Not much to say. Just follow the test instuctions for a good password and increment accordingly.
 */

import AOCBase from "../../AOCBase";

export default class Solution implements AOCBase {
  readonly sampleInput = `abcdefgh`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    return input;
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    let password = this.parseInput(input);
    const alphabet = 'abcdefghijklmnopqrstuvwxyz';
    const straightCandidates1 = 'abcdefgh'; // since i, o, l aren't allowed, remove any letters that would have those as part of the straight
    const straightCandidates2 = 'pqrstuvwxyz';

    // calculate the incremented value of every character once so we don't have to keep doing indexOf later on
    const charIncrements = new Map<string, string>();
    for (let i=0; i < alphabet.length; i++) {
      const thisChar = alphabet.charAt(i);
      const nextChar = i < alphabet.length-1 ? alphabet.charAt(i+1) : 'a';
      charIncrements.set(thisChar, nextChar);
    }

    const testIOL = (pw: string) => {
      return !pw.match(/[iol]/);
    };

    const testStraight = (pw: string) => {
      for (let i=0; i < straightCandidates1.length-2; i++) {
        const sub = straightCandidates1.substring(i, i+3);
        if (pw.match(sub)) {
          return true;
        }
      }

      for (let i=0; i < straightCandidates2.length-2; i++) {
        const sub = straightCandidates2.substring(i, i+3);
        if (pw.match(sub)) {
          return true;
        }
      }
      
      return false;
    }

    const testTwoPair = (pw: string) => {
      let firstPair: string|null = null;
      for (let i=0; i < pw.length-1; i++) {
        const thisChar = pw.charAt(i);
        const nextChar = pw.charAt(i+1);
        if (thisChar === firstPair) {
          continue;
        }
        if (thisChar === nextChar) {
          if (!firstPair) {
            firstPair = thisChar;
          } else {
            return true;
          }
        }
      }

      return false;
    }

    const testPassword = (pw: string) => {
      return testIOL(pw) && testStraight(pw) && testTwoPair(pw);
    };

    const increment = (pw: string[], index: number) => {
      const char = pw[pw.length + index];
      const incrementedChar = charIncrements.get(char)!;
      pw[pw.length + index] = incrementedChar;

      if (incrementedChar === 'a') {
        increment(pw, index-1);
      }

      return pw.join('');
    };

    do {
      password = increment(password.split(''), -1);
    } while (!testPassword(password))

    return {
      performance: performance.now() - performanceStart, 
      result: password
    }
  }
}
