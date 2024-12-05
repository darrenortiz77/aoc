/**
 * https://adventofcode.com/2022/day/11
 *
 * General solution:
 */

import CodeRunner from "../../CodeRunner";

export default class DayElevenPartOne extends CodeRunner {
	private monkeys: Monkey[] = [];

  public run(input?: string) {
    if (!input) {
      input = `Monkey 0:
  Starting items: 79, 98
  Operation: new = old * 19
  Test: divisible by 23
    If true: throw to monkey 2
    If false: throw to monkey 3

Monkey 1:
  Starting items: 54, 65, 75, 74
  Operation: new = old + 6
  Test: divisible by 19
    If true: throw to monkey 2
    If false: throw to monkey 0

Monkey 2:
  Starting items: 79, 60, 97
  Operation: new = old * old
  Test: divisible by 13
    If true: throw to monkey 1
    If false: throw to monkey 3

Monkey 3:
  Starting items: 74
  Operation: new = old + 3
  Test: divisible by 17
    If true: throw to monkey 0
    If false: throw to monkey 1`;
    }
    
    const performanceStart = performance.now();
    const lines = input.split('\n');

		for (let i=0; i < lines.length; i += 7) {
			const items = lines[i+1].split(': ')[1].split(', ').map(n => +n);
			const operation = lines[i+2].split('new = old ')[1].split(' ');
			const testCondition = +lines[i+3].split('divisible by ')[1];
			const monkeyDestTrue = +lines[i+4].match(/\b\d+?\b/)![0];
			const monkeyDestFalse = +lines[i+5].match(/\b\d+?\b/)![0];
			const monkey = new Monkey({items, operation, testCondition, monkeyDestTrue, monkeyDestFalse});
			this.monkeys.push(monkey);
		}

		for (let i=0; i < 20; i++) {
			this.processRound();
		}

		const inspectionAmounts = this.monkeys.map(monkey => monkey.timesInspected);
		inspectionAmounts.sort((a,b) => b-a);

    return {
      performance: performance.now() - performanceStart, 
      result: inspectionAmounts[0] * inspectionAmounts[1]
    }
  }

	private processRound() {
		this.monkeys.forEach(monkey => {
			while (monkey.hasItems) {
				const {targetMonkey, item} = monkey.inspectItem();
				this.monkeys[targetMonkey].addItem(item);
			}
		});
	}
}

type MonkeyProps = {
	items: number[];
	operation: string[];
	testCondition: number;
	monkeyDestTrue: number;
	monkeyDestFalse: number;
};

class Monkey {
	private _items: number[];
	private operation: string[];
	private testCondition: number;
	private monkeyDestTrue: number;
	private monkeyDestFalse: number;
	private _timesInspected = 0;

	constructor({items, operation, testCondition, monkeyDestTrue, monkeyDestFalse}: MonkeyProps) {
		this._items = items;
		this.operation = operation;
		this.testCondition = testCondition;
		this.monkeyDestTrue = monkeyDestTrue;
		this.monkeyDestFalse = monkeyDestFalse;
	}

	public get hasItems() {
		return this._items.length > 0;
	}

	public get items() {
		return this._items;
	}

	public get timesInspected() {
		return this._timesInspected;
	}

	public inspectItem() {
		this._timesInspected++;

		let item = this._items.shift()!;

		const operand = this.operation[1] === 'old' ? item : +this.operation[1];

		switch (this.operation[0]) {
			case '+':
				item += operand;
				break;
			case '-':
				item -= operand;
				break;
			case '*':
				item *= operand;
				break;
			case '/':
				item /= operand;
				break;
		}

		item = Math.floor(item / 3);

		const targetMonkey = (item % this.testCondition === 0) ? this.monkeyDestTrue : this.monkeyDestFalse;

		return {item, targetMonkey};
	}

	public addItem(item: number) {
		this._items.push(item);
	}
}
