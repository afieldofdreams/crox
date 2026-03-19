import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import { Layout } from './components/Layout';
import HomePage from './pages/HomePage';
import AboutPage from './pages/AboutPage';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<BrowserRouter>
			<Routes>
				<Route element={<Layout />}>
					<Route index element={<HomePage />} />
					<Route path="about" element={<AboutPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	</StrictMode>
);
