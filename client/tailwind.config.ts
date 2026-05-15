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
				bg: '#12100e',
				fg: '#e8e4de',
				'fg-dim': '#d0cbc5',
				accent: '#e07070',
				'accent-hover': '#c4472e',
				surface: '#1a1716',
				border: '#332e2b',
				rust: '#c4472e',
				clay: '#9d6b53',
				slate: '#5a5550',
				ash: '#3d3936',
				cream: '#d4cfc5',
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
