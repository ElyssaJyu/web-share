import { terser } from 'rollup-plugin-terser';
import commonjs from 'rollup-plugin-commonjs';
import copy from 'rollup-plugin-copy';
import css from 'rollup-plugin-css-only';
import replace from 'rollup-plugin-replace';
import resolve from 'rollup-plugin-node-resolve';
import svelte from 'rollup-plugin-svelte';

export default [{
	input: 'src/js/app.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'app',
		dir: 'public',
		entryFileNames: 'js/[name].js'
	},
	plugins: [
		copy({
			targets: [
				{ src: 'src/*.{json,html}', dest: 'public' },
				{ src: 'src/css/**/*', dest: 'public/css' },
				{ src: 'src/images/**/*', dest: 'public/images' },
			],
		}),
		svelte(),
		css({
			output: 'css/svelte.css',
		}),
		resolve({
			browser: true,
			dedupe: (importee) => importee === 'svelte' || importee.startsWith('svelte/'),
		}),
		commonjs(),
		terser(),
	],
}, {
	input: 'src/js/service-worker.js',
	output: {
		sourcemap: true,
		format: 'iife',
		name: 'workbox',
		file: 'public/service-worker.js'
	},
	plugins: [
		svelte({
			emitCss: false,
		}),
		resolve(),
		commonjs(),
		replace({
			'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
		}),
		terser(),
	],
}];
