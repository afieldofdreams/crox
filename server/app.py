from __future__ import annotations

import os
import re
import time
from flask import Flask, request, jsonify, Blueprint, g
from flask_cors import CORS
from werkzeug.utils import secure_filename


def create_app() -> Flask:
	app = Flask(__name__)

	# Config
	app.config['ENV'] = os.getenv('FLASK_ENV', 'development')
	app.config['CORS_ORIGINS'] = os.getenv('CORS_ORIGINS', 'http://localhost:5173')

	# CORS
	CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS'].split(',')}})

	# Simple in-memory rate limiter
	rates: dict[str, list[float]] = {}

	@app.before_request
	def before_request():
		g.start_time = time.time()
		# rate limit per IP: 20 req / 60s
		ip = request.headers.get('X-Forwarded-For', request.remote_addr) or 'unknown'
		window = 60.0
		limit = 20
		bucket = rates.setdefault(ip, [])
		now = time.time()
		# prune old
		rates[ip] = [t for t in bucket if now - t < window]
		if len(rates[ip]) >= limit:
			return jsonify({"error": "rate_limited"}), 429
		rates[ip].append(now)

	@app.after_request
	def set_headers(resp):
		resp.headers['X-Content-Type-Options'] = 'nosniff'
		resp.headers['X-Frame-Options'] = 'DENY'
		resp.headers['Referrer-Policy'] = 'strict-origin-when-cross-origin'
		resp.headers['Permissions-Policy'] = 'camera=(), microphone=(), geolocation=()'
		return resp

	# Blueprint
	api = Blueprint('api', __name__, url_prefix='/api')

	@api.route('/plan', methods=['POST'])
	def plan():
		data = request.get_json(silent=True) or {}
		text = str(data.get('text', '')).strip()
		if not text:
			return jsonify({"steps": [
				"Define the goal",
				"List the constraints",
				"Sketch a solution",
				"Test assumptions",
				"Ship a first pass"
			]}), 200
		# deterministic mock: split words into 5 buckets
		words = re.findall(r"\w+", text)
		buckets = [" ".join(words[i::5]) or "Refine details" for i in range(5)]
		steps = [s.capitalize() for s in buckets]
		return jsonify({"steps": steps})

	@api.route('/tone', methods=['POST'])
	def tone():
		data = request.get_json(silent=True) or {}
		text = str(data.get('text', '')).strip()
		tone = str(data.get('tone', 'friendly')).strip().lower()
		templates = {
			'professional': lambda t: f"In summary: {t}"
			,
			'friendly': lambda t: f"Here’s the gist: {t} 😊"
			,
			'playful': lambda t: f"Quick take: {t}! ✨"
		}
		fn = templates.get(tone, templates['friendly'])
		return jsonify({"result": fn(text or 'No text provided')})

	@api.route('/caption', methods=['POST'])
	def caption():
		if 'image' not in request.files:
			return jsonify({"alt": "No image uploaded"})
		img = request.files['image']
		filename = secure_filename(img.filename or 'image')
		desc = filename.rsplit('.', 1)[0].replace('-', ' ').replace('_', ' ').strip() or 'image'
		return jsonify({"alt": f"A clear photo named {desc}."})

	@api.route('/contact', methods=['POST'])
	def contact():
		data = request.get_json(silent=True) or {}
		name = str(data.get('name', '')).strip()
		email = str(data.get('email', '')).strip()
		message = str(data.get('message', '')).strip()
		if not name or not email or not message:
			return jsonify({"ok": False}), 400
		if app.config['ENV'] == 'development':
			print(f"CONTACT -> {name} <{email}>: {message[:140]}")
		return jsonify({"ok": True})

	app.register_blueprint(api)
	return app


if __name__ == '__main__':
	app = create_app()
	app.run(host='0.0.0.0', port=int(os.getenv('PORT', '5000')))


