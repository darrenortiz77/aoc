import { resolve } from 'path';
import { existsSync, mkdirSync } from 'fs';
import { execSync, exec } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const d = new Date();

const [, , ...args] = process.argv;

let year = d.getFullYear();
let day = d.getDate();

if (args.length === 1) {
	day = args[0];
} else if (args.length === 2) {
	year = parseInt(args[0], 10);
	if (year < 100) {
		year += 2000;
	}
	day = args[1];
}

const paddedDay = `${day}`.padStart(2, '0');

const dayPath = resolve(__dirname, `src/${year}/${paddedDay}`);
const templatePath = resolve(__dirname, 'src/_template/day');
if (existsSync(dayPath)) {
	// eslint-disable-next-line no-console
	console.log(`Directory ${dayPath} already exists; exiting`);
	process.exit(0);
}

// eslint-disable-next-line no-console
console.log(`Creating ${dayPath}`);
mkdirSync(dayPath, { recursive: true });
execSync(`cp -R ${templatePath}/* ${dayPath}`);

const cmd =
	process.platform === 'darwin' ? 'open' :
		process.platform === 'win32' ? 'start' :
			'xdg-open';
const dayUrl = `https://adventofcode.com/${year}/day/${parseInt(day, 10)}`;
exec(`${cmd} ${dayUrl}`);
exec(`${cmd} ${dayUrl}/input`);

execSync('npm run dev');