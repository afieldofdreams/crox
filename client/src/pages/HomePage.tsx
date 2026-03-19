import { useState, FormEvent } from 'react';
import { Helmet } from 'react-helmet-async';

const testimonials = [
	{
		quote: 'Adam cares deeply about the quality and impact of his work.',
		name: 'Jasel Mehta',
		role: 'COO',
	},
	{
		quote: 'He was amazingly fast and uncomplicated in delivering an extensive, clear, and detailed report.',
		name: 'Romina Buchel',
		role: 'Marketing Manager',
	},
	{
		quote: 'A man of many talents who can focus on the job in hand with precision and get results.',
		name: 'Sam Smith',
		role: 'Design Lead',
	},
	{
		quote: 'He was very professional, I\'d highly recommend on projects that need an eye for detail.',
		name: 'Scott Beat',
		role: 'Quality Manager',
	},
	{
		quote: 'Extremely knowledgeable who provided fantastic and thorough outputs!',
		name: 'Maria Birkmyre',
		role: 'Director',
	},
];

function ContactForm() {
	const [status, setStatus] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

	async function handleSubmit(e: FormEvent<HTMLFormElement>) {
		e.preventDefault();
		setStatus('sending');

		const form = e.currentTarget;
		const data = new FormData(form);

		try {
			const res = await fetch('https://formspree.io/f/mpqybqpg', {
				method: 'POST',
				body: data,
				headers: { Accept: 'application/json' },
			});

			if (res.ok) {
				setStatus('sent');
				form.reset();
			} else {
				setStatus('error');
			}
		} catch {
			setStatus('error');
		}
	}

	if (status === 'sent') {
		return (
			<div className="bg-surface border border-border p-8">
				<p className="font-serif text-[1.2rem] text-fg mb-2">Message sent.</p>
				<p className="text-[0.8rem] text-fg-dim">I'll get back to you shortly.</p>
			</div>
		);
	}

	return (
		<form onSubmit={handleSubmit} className="space-y-6">
			<div className="grid grid-cols-2 gap-6 max-sm:grid-cols-1">
				<div>
					<label htmlFor="name" className="block text-[0.65rem] tracking-[0.15em] uppercase text-fg-dim mb-2">
						Name
					</label>
					<input
						type="text"
						id="name"
						name="name"
						required
						className="w-full bg-surface border border-border px-4 py-3 text-[0.85rem] text-fg placeholder:text-fg-dim/50 transition-colors focus:border-accent outline-none"
						placeholder="Your name"
					/>
				</div>
				<div>
					<label htmlFor="email" className="block text-[0.65rem] tracking-[0.15em] uppercase text-fg-dim mb-2">
						Email
					</label>
					<input
						type="email"
						id="email"
						name="email"
						required
						className="w-full bg-surface border border-border px-4 py-3 text-[0.85rem] text-fg placeholder:text-fg-dim/50 transition-colors focus:border-accent outline-none"
						placeholder="you@company.com"
					/>
				</div>
			</div>
			<div>
				<label htmlFor="message" className="block text-[0.65rem] tracking-[0.15em] uppercase text-fg-dim mb-2">
					What are you working on?
				</label>
				<textarea
					id="message"
					name="message"
					required
					rows={4}
					className="w-full bg-surface border border-border px-4 py-3 text-[0.85rem] text-fg placeholder:text-fg-dim/50 transition-colors focus:border-accent outline-none resize-none"
					placeholder="Tell me about your project or challenge..."
				/>
			</div>
			<button
				type="submit"
				disabled={status === 'sending'}
				className="font-mono text-[0.75rem] font-medium tracking-[0.15em] uppercase text-fg bg-accent px-10 py-4 transition-all hover:bg-[#d64f34] hover:-translate-y-px disabled:opacity-50 disabled:cursor-not-allowed"
			>
				{status === 'sending' ? 'Sending...' : 'Send message'}
			</button>
			{status === 'error' && (
				<p className="text-[0.8rem] text-accent">Something went wrong. Try emailing me directly at adam@crox.io.</p>
			)}
		</form>
	);
}

export default function HomePage() {
	return (
		<>
			<Helmet>
				<title>Crox — Adam Field | AI Product Leadership in Regulated Industries</title>
				<meta name="description" content="Adam Field helps organisations build better AI products in regulated industries. Advisory, DODAR workshops, and hands-on build services. Healthcare, legal, fintech, insurance." />
				<link rel="canonical" href="https://crox.io/" />
				<meta property="og:title" content="Crox — Adam Field | AI Product Leadership" />
				<meta property="og:description" content="Helping busy organisations build better AI products. Advisory, workshops, and hands-on build services for regulated industries." />
				<meta property="og:url" content="https://crox.io/" />
				<meta property="og:type" content="website" />
				<meta property="og:image" content="https://crox.io/og.png" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Crox — Adam Field | AI Product Leadership" />
				<meta name="twitter:description" content="Helping busy organisations build better AI products in regulated industries." />
				<meta name="twitter:image" content="https://crox.io/og.png" />
			</Helmet>

			{/* Hero */}
			<div className="py-24 pb-16 border-b border-border">
				<h1 className="font-serif font-normal text-[3.2rem] leading-[1.15] mb-8 max-sm:text-[2.2rem]">
					Helping busy organisations<br />build <em className="italic text-accent">better</em> products.
				</h1>
				<p className="text-[0.95rem] text-fg-dim max-w-[560px] leading-[1.8]">
					I'm Adam Field. AI product leader, former commercial pilot, builder. A decade of shipping
					in healthcare, legal, insurance, and fintech — environments where compliance isn't optional
					and safety isn't a feature request.
				</p>
			</div>

			{/* Offerings */}
			<section className="py-16 border-b border-border">
				<div className="text-[0.65rem] tracking-[0.2em] uppercase text-fg-dim mb-8 flex items-center gap-4">
					How I help
					<span className="flex-1 h-px bg-border" />
				</div>

				<div className="grid gap-6">
					<div className="bg-surface border border-border p-8 transition-colors hover:border-accent">
						<h3 className="font-serif font-normal text-[1.2rem] mb-2">AI Product Advisory</h3>
						<p className="text-[0.85rem] text-fg-dim leading-[1.7] mb-4">
							You're building with AI in a regulated space and need someone who's shipped there before.
							I work with founders and product teams as a fractional advisor — strategy, architecture
							decisions, compliance navigation, and the hard calls about what to build next.
						</p>
						<p className="text-[0.8rem] text-fg-dim leading-[1.6]">
							Healthcare, legal tech, fintech, insurance. Async reviews, weekly syncs, or intensive sprints.
						</p>
					</div>

					<div className="bg-surface border border-border p-8 transition-colors hover:border-accent">
						<h3 className="font-serif font-normal text-[1.2rem] mb-2">DODAR Workshops</h3>
						<p className="text-[0.85rem] text-fg-dim leading-[1.7] mb-4">
							Your team makes decisions under pressure but doesn't have a shared framework for it.
							DODAR is how aviation stays the safest industry on earth. I run half-day sessions that
							give your team a repeatable process they can use the following Monday.
						</p>
						<p className="text-[0.8rem] text-fg-dim leading-[1.6]">
							Remote or on-site. Up to 15 participants. Includes templates, facilitation guide, and written debrief.
						</p>
					</div>

					<div className="bg-surface border border-border p-8 transition-colors hover:border-accent">
						<h3 className="font-serif font-normal text-[1.2rem] mb-2">Build & Ship</h3>
						<p className="text-[0.85rem] text-fg-dim leading-[1.7] mb-4">
							Sometimes you don't need advice — you need someone to build the thing. I write production
							code, prototype with LLMs, and ship end-to-end. From AI-powered workflows to full-stack
							tools, I go from brief to working product.
						</p>
						<p className="text-[0.8rem] text-fg-dim leading-[1.6]">
							Python, Next.js, LLM integrations. Zero-to-one builds or targeted feature work.
						</p>
					</div>
				</div>
			</section>

			{/* Testimonials */}
			<section className="py-16 border-b border-border">
				<div className="text-[0.65rem] tracking-[0.2em] uppercase text-fg-dim mb-8 flex items-center gap-4">
					Trusted by others
					<span className="flex-1 h-px bg-border" />
				</div>

				<div className="space-y-6">
					{testimonials.map((t) => (
						<div key={t.name} className="border-l-2 border-accent/30 pl-6 py-1">
							<p className="font-serif text-[1.05rem] text-fg leading-[1.5] mb-2">
								"{t.quote}"
							</p>
							<p className="text-[0.75rem] text-fg-dim">
								{t.name} <span className="text-fg-dim">— {t.role}</span>
							</p>
						</div>
					))}
				</div>
			</section>

			{/* Writing */}
			<section className="py-16 border-b border-border">
				<div className="text-[0.65rem] tracking-[0.2em] uppercase text-fg-dim mb-8 flex items-center gap-4">
					Writing
					<span className="flex-1 h-px bg-border" />
				</div>

				<ul className="list-none">
					<li className="py-4 border-b border-border flex justify-between items-baseline gap-8">
						<a href="https://www.linkedin.com/in/afieldio" target="_blank" rel="noopener noreferrer" className="font-serif text-[1.1rem] text-fg no-underline hover:text-accent transition-colors">
							AI, product, and systems thinking
						</a>
						<span className="text-[0.65rem] tracking-[0.1em] uppercase text-fg-dim whitespace-nowrap">LinkedIn</span>
					</li>
					<li className="py-4 border-b border-border flex justify-between items-baseline gap-8">
						<a href="https://substack.com/@adamfield" target="_blank" rel="noopener noreferrer" className="font-serif text-[1.1rem] text-fg no-underline hover:text-accent transition-colors">
							Long-form essays
						</a>
						<span className="text-[0.65rem] tracking-[0.1em] uppercase text-fg-dim whitespace-nowrap">Substack</span>
					</li>
					<li className="py-4 flex justify-between items-baseline gap-8">
						<a href="https://github.com/afieldofdreams" target="_blank" rel="noopener noreferrer" className="font-serif text-[1.1rem] text-fg no-underline hover:text-accent transition-colors">
							Open source & proof of work
						</a>
						<span className="text-[0.65rem] tracking-[0.1em] uppercase text-fg-dim whitespace-nowrap">GitHub</span>
					</li>
				</ul>
			</section>

			{/* Contact */}
			<section id="contact" className="py-16">
				<div className="text-[0.65rem] tracking-[0.2em] uppercase text-fg-dim mb-8 flex items-center gap-4">
					Get in touch
					<span className="flex-1 h-px bg-border" />
				</div>

				<p className="text-[0.85rem] text-fg-dim leading-[1.8] mb-8 max-w-[480px]">
					Tell me what you're working on. I'll reply within a day — usually faster.
				</p>

				<ContactForm />

				<div className="mt-10 pt-8 border-t border-border grid grid-cols-2 gap-8 max-sm:grid-cols-1">
					<div className="text-[0.8rem]">
						<div className="text-[0.65rem] tracking-[0.15em] uppercase text-fg-dim mb-2">Email directly</div>
						<a href="mailto:adam@crox.io" className="text-fg no-underline border-b border-border pb-px hover:border-accent transition-colors">
							adam@crox.io
						</a>
					</div>
					<div className="text-[0.8rem]">
						<div className="text-[0.65rem] tracking-[0.15em] uppercase text-fg-dim mb-2">LinkedIn</div>
						<a href="https://www.linkedin.com/in/afieldio" target="_blank" rel="noopener noreferrer" className="text-fg no-underline border-b border-border pb-px hover:border-accent transition-colors">
							linkedin.com/in/afieldio
						</a>
					</div>
				</div>
			</section>
		</>
	);
}
