import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
	plugins: [react()],
	server: {
	 	port: 3099,
	 	strictPort: true,
	 	proxy: {
	 		'/api': 'http://localhost:5000'
	 	}
 	},
	build: {
 		target: 'es2020'
 	}
});


