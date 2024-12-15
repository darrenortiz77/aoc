const defaultCheckForValid = <T>(current: T, target: T) => {
	if (current === target) {
		return true;
	}

	if (current > target) {
		return false;
	}

	return null;
};

const defaultUpdateCurrent = <T, C>(current: T, candidate: C, temp: C[]): T => {
	return (current as number) + (candidate as number) as T;
};

/**
 * A way to recursively check every possible combination of an array of candidates.
 * 
 * candidates: list of potentials
 * initial: initial value
 * target: some target value we're aiming for
 * checkForValid: function to test if we've found a valid candidate
 * updateCurrent: update the current value as we loop through candidates
 */
export const backtracker = <C, T>(
	candidates: C[], 
	initial: T, 
	target: T, 
	checkForValid: (current: T, target: T) => boolean|null = defaultCheckForValid, 
	updateCurrent: (current: T, candidate: C, temp: C[]) => T = defaultUpdateCurrent
) => {
	const temp: C[] = []; // temp solutions that gets backtracked over
	const valids: C[][] = []; // working solutions added here

	const backtrack = (idx: number, current: T) => {
		const isValid = checkForValid(current, target);

		if (isValid === true) {
			return valids.push([...temp]);
		}

		if (isValid === false) {
			return;
		}

		// ran out of possibilities, move on
		if (idx === candidates.length) {
			return;
		}

		temp.push(candidates[idx]);
		backtrack(idx, updateCurrent(current, candidates[idx], temp));
		temp.pop();
		backtrack(idx+1, initial);
	};

	backtrack(0, initial);

	return valids;
}
