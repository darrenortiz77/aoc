import { defineConfig } from 'vite';
import { resolve } from 'path';
import fg from 'fast-glob';

export default defineConfig({
	server: {
		open: true,
	},
	resolve: {
		alias: {
			'@': resolve(__dirname, './src'),
		},
	},
	build: {
		rollupOptions: {
			input: {
				main: './index.html',
				...Object.fromEntries(
					fg.sync('./src/day*/*.ts').map(file => [
						file.replace('./src/', '').replace('.ts', ''),
						resolve(__dirname, file)
					])
				)
			},
			output: {
				entryFileNames: '[name].js',
				chunkFileNames: '[name].js',
				assetFileNames: 'assets/[name].[ext]',
			},
		},
	},
});