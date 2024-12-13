export default interface AOCBase {
	readonly sampleInput: string;

	parseInput(input?: string): unknown;
	solve(input?: string): {performance: number, result: number|string};
}
