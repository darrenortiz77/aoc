export default abstract class CodeRunner {
	abstract run(input?: string): {performance: number, result: unknown};
}
