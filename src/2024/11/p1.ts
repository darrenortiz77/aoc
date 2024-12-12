/**
 * https://adventofcode.com/2024/day/11
 *
 * General solution:
 * Linked List
 */

import AOCBase from "../../AOCBase";

class ListItem {
  public next: ListItem|null = null;

  constructor(public value: number) {

  }
}

export default class Solution implements AOCBase {
  readonly sampleInput = `125 17`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    const stones = input.split(' ').map(Number);
    const head = new ListItem(stones[0]);
    let li = head;

    for (let i=1; i < stones.length; i++) {
      const next = new ListItem(stones[i]);
      li.next = next;
      li = next;
    }

    return {head, numStones: stones.length};
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    let {head, numStones}  = this.parseInput(input);

    const blink = () => {
      let li: ListItem|null = head;

      while (li) {
        const nextToProcess: ListItem = li.next!;
        const valueAsString = `${li.value}`;

        if (li.value === 0) {
          li.value = 1;
        } else if (valueAsString.length % 2 === 0) {
          li.value = +valueAsString.slice(0, valueAsString.length/2);
          const newStone = new ListItem(+valueAsString.slice(valueAsString.length/2));
          li.next = newStone;
          newStone.next = nextToProcess;
          numStones++;
        } else {
          li.value *= 2024;
        }

        li = nextToProcess;
      }
    };

    for (let i=0; i < 25; i++) {
      blink();
      // console.log(this.linkedListToArray(head));
    }

    return {
      performance: performance.now() - performanceStart, 
      result: numStones
    }
  }

  private linkedListToArray(li: ListItem|null) {
    const arr: number[] = [];
    while (li) {
      arr.push(li.value);
      li = li.next;
    }
    return arr;
  }
}
