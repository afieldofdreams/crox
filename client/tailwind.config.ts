import type { Config } from 'tailwindcss';

export default {
	content: [
		'./src/**/*.{astro,ts,tsx}',
	],
	theme: {
		container: {
			center: true,
			padding: '2rem',
		},
		extend: {
			colors: {
				bg: '#0a0a0a',
				fg: '#e8e4de',
				'fg-dim': '#d0cbc5',
				accent: '#e05a3a',
				surface: '#141414',
				border: '#333333',
			},
			fontFamily: {
				serif: ['"Instrument Serif"', 'Georgia', 'serif'],
				mono: ['"DM Mono"', '"Courier New"', 'monospace'],
			},
			maxWidth: {
				content: '900px',
			},
		},
	},
	plugins: [],
} satisfies Config;
