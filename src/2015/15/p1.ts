/**
 * https://adventofcode.com/2015/day/15
 *
 * General solution:
 * Backtracking
 */

import AOCBase from "../../AOCBase";
import { backtracker } from "../../utils/backtrack";

type Ingredient = {
  name: string;
  capacity: number;
  durability: number;
  flavor: number;
  texture: number;
  calories: number;
}

export default class Solution implements AOCBase {
  readonly sampleInput = `Butterscotch: capacity -1, durability -2, flavor 6, texture 3, calories 8
Cinnamon: capacity 2, durability 3, flavor -2, texture -1, calories 3`;

  public parseInput(input?: string) {
    if (!input) {
      input = this.sampleInput;
    }

    const ingredients = new Map<string, Ingredient>();
    input.split('\n').forEach(line => {
      const matches = line.match(/(\w+)\D+ (-?\d+)\D+ (-?\d+)\D+ (-?\d+)\D+ (-?\d+)\D+ (-?\d+)/)!;
      ingredients.set(matches[1], {
        name: matches[1],
        capacity: +matches[2],
        durability: +matches[3],
        flavor: +matches[4],
        texture: +matches[5],
        calories: +matches[6],
      });
    });
    return ingredients;
  }

  public solve(input?: string) {    
    const performanceStart = performance.now();

    const ingredients = this.parseInput(input);
    
    const valids = backtracker<Ingredient, number>([...ingredients.values()], 0, 100, undefined, (current, candidate, temp) => {
      return temp.length;
    });

    let result = 0;
    valids.forEach(combination => {
      result = Math.max(result, calculateCookieScore(combination, ingredients));
    });

    return {
      performance: performance.now() - performanceStart, 
      result
    }
  }
}

function calculateCookieScore(combination: Ingredient[], ingredients: Map<string, Ingredient>) {
  const numOfEach = new Map<string, number>();

  for (const ingredient of combination) {
    numOfEach.set(ingredient.name, (numOfEach.get(ingredient.name) ?? 0) + 1);
  }

  let capacity = 0;
  let durability = 0;
  let flavor = 0;
  let texture = 0;
  
  for (const [name, num] of numOfEach) {
    capacity += num * ingredients.get(name)!.capacity;
    durability += num * ingredients.get(name)!.durability;
    flavor += num * ingredients.get(name)!.flavor;
    texture += num * ingredients.get(name)!.texture;
  }

  if (capacity <= 0 || durability <= 0 || flavor <= 0 || texture <= 0) {
    return 0;
  }
  
  return capacity * durability * flavor * texture;
}
