import puppeteer from 'puppeteer';
import { writeFileSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, '..', 'dist');

const routes = ['/', '/about', '/ai-integration'];

async function prerender() {
	const { default: handler } = await import('serve-handler');
	const http = await import('http');

	const server = http.createServer((req, res) => {
		return handler(req, res, {
			public: distDir,
			rewrites: [{ source: '**', destination: '/index.html' }],
		});
	});

	await new Promise((r) => server.listen(0, r));
	const port = server.address().port;

	const browser = await puppeteer.launch({ headless: true });

	// Prerender pages
	for (const route of routes) {
		const page = await browser.newPage();
		await page.goto(`http://localhost:${port}${route}`, {
			waitUntil: 'networkidle0',
		});

		const html = await page.content();
		const filePath =
			route === '/'
				? resolve(distDir, 'index.html')
				: resolve(distDir, route.slice(1), 'index.html');

		mkdirSync(dirname(filePath), { recursive: true });
		writeFileSync(filePath, html);
		console.log(`Prerendered: ${route} -> ${filePath}`);
		await page.close();
	}

	// Generate OG image
	const ogPage = await browser.newPage();
	await ogPage.setViewport({ width: 1200, height: 630 });
	await ogPage.setContent(`
		<!DOCTYPE html>
		<html>
		<head>
			<link href="https://fonts.googleapis.com/css2?family=DM+Mono:wght@300;400;500&family=Instrument+Serif:ital@0;1&display=swap" rel="stylesheet" />
			<style>
				* { margin: 0; padding: 0; box-sizing: border-box; }
				body {
					width: 1200px; height: 630px;
					background: #0a0a0a;
					color: #e8e4de;
					font-family: 'DM Mono', monospace;
					display: flex;
					flex-direction: column;
					justify-content: center;
					padding: 80px;
				}
				h1 {
					font-family: 'Instrument Serif', Georgia, serif;
					font-weight: 400;
					font-size: 64px;
					line-height: 1.15;
					margin-bottom: 24px;
				}
				h1 em { color: #e05a3a; font-style: italic; }
				p {
					font-size: 22px;
					color: #8a8680;
					font-weight: 300;
					max-width: 700px;
					line-height: 1.6;
				}
				.logo {
					position: absolute;
					bottom: 60px;
					left: 80px;
					font-size: 16px;
					letter-spacing: 0.15em;
					text-transform: uppercase;
					font-weight: 500;
					color: #8a8680;
				}
				.url {
					position: absolute;
					bottom: 60px;
					right: 80px;
					font-size: 16px;
					color: #8a8680;
					font-weight: 300;
				}
			</style>
		</head>
		<body>
			<h1>Helping busy organisations<br>build <em>better</em> products.</h1>
			<p>AI product leadership in regulated industries. Advisory, workshops, and hands-on build.</p>
			<div class="logo">Crox</div>
			<div class="url">crox.io</div>
		</body>
		</html>
	`, { waitUntil: 'networkidle0' });

	// Wait for fonts to load
	await ogPage.evaluate(() => document.fonts.ready);
	await new Promise((r) => setTimeout(r, 500));

	await ogPage.screenshot({
		path: resolve(distDir, 'og.png'),
		type: 'png',
	});
	console.log('Generated: og.png');
	await ogPage.close();

	await browser.close();
	server.close();
}

prerender().catch((err) => {
	console.warn('Prerender skipped (no browser available):', err.message);
	// Non-fatal — the SPA still works without prerendering
});
