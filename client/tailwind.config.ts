import type { Config } from 'tailwindcss';

export default {
	content: [
		'./index.html',
		'./src/**/*.{ts,tsx}',
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
				'fg-dim': '#8a8680',
				accent: '#c4442a',
				surface: '#141414',
				border: '#2a2a2a',
			},
			fontFamily: {
				serif: ['"Instrument Serif"', 'Georgia', 'serif'],
				mono: ['"DM Mono"', '"Courier New"', 'monospace'],
			},
			maxWidth: {
				content: '720px',
			},
		},
	},
	plugins: [],
} satisfies Config;
