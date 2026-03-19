import { Helmet } from 'react-helmet-async';
import { Link } from 'react-router-dom';

const BOOKING_URL = 'https://calendar.app.google/3avUXyXnctfWpyHF7';

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

export default function HomePage() {
	return (
		<>
			<Helmet>
				<title>Crox — AI That Works in Your Business | Advisory, Integration & Workshops</title>
				<meta name="description" content="Crox helps small and mid-sized businesses get real value from AI. Strategy, integration, and decision-making workshops for regulated industries: healthcare, legal, finance, insurance." />
				<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
				<link rel="canonical" href="https://crox.io/" />
				<meta property="og:title" content="Crox — AI That Works in Your Business" />
				<meta property="og:description" content="Crox helps SMEs get real value from AI. Strategy, integration, and workshops for regulated industries." />
				<meta property="og:url" content="https://crox.io/" />
				<meta property="og:type" content="website" />
				<meta property="og:site_name" content="Crox" />
				<meta property="og:image" content="https://crox.io/og.png" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="Crox — AI That Works in Your Business" />
				<meta name="twitter:description" content="Crox helps SMEs get real value from AI. Strategy, integration, and workshops for regulated industries." />
				<meta name="twitter:image" content="https://crox.io/og.png" />
				<script type="application/ld+json">{JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'Organization',
					name: 'Crox',
					url: 'https://crox.io',
					logo: 'https://crox.io/og.png',
					description: 'Crox helps small and mid-sized businesses connect AI assistants to their existing tools using the Model Context Protocol.',
					founder: { '@type': 'Person', name: 'Adam Field' },
					sameAs: ['https://linkedin.com/in/afieldio'],
				})}</script>
				<script type="application/ld+json">{JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'WebSite',
					name: 'Crox',
					url: 'https://crox.io',
				})}</script>
			</Helmet>

			{/* Hero */}
			<div className="py-24 pb-16 border-b border-border">
				<h1 className="font-serif font-normal text-[3.2rem] leading-[1.15] mb-8 max-sm:text-[2.2rem]">
					AI that works in your business.<br />Not just in <em className="italic text-accent">theory.</em>
				</h1>
				<p className="text-[1rem] text-fg-dim leading-[1.8] mb-10">
					Crox helps small and mid-sized businesses get real value from AI. From strategy through to
					implementation. We specialise in regulated industries where getting it right matters: healthcare,
					legal, finance, and insurance.
				</p>
				<a
					href={BOOKING_URL}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-block font-mono text-[0.8rem] font-medium tracking-[0.15em] uppercase text-fg bg-accent px-10 py-4 transition-all hover:bg-[#c4472e] hover:-translate-y-px no-underline"
				>
					Book a free discovery call →
				</a>
			</div>

			{/* What We Do */}
			<section className="py-16 border-b border-border">
				<div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim mb-8 flex items-center gap-4">
					What we do
					<span className="flex-1 h-px bg-border" />
				</div>

				<div className="grid gap-6">
					<div className="bg-surface border border-border p-8 transition-colors hover:border-accent">
						<h3 className="font-serif font-normal text-[1.3rem] mb-2">AI Product Advisory</h3>
						<p className="text-[0.95rem] text-fg-dim leading-[1.7] mb-4">
							You're building an AI product or bringing AI into your operations — but you need someone
							who's done it before. We provide fractional product guidance covering strategy, architecture,
							and compliance, so you make the right decisions early.
						</p>
						<p className="text-[0.9rem] text-fg-dim leading-[1.6]">
							Ideal for founders and product leads in regulated sectors who need experienced thinking without a full-time hire.
						</p>
					</div>

					<div className="bg-surface border border-border p-8 transition-colors hover:border-accent">
						<h3 className="font-serif font-normal text-[1.3rem] mb-2">AI Integration</h3>
						<p className="text-[0.95rem] text-fg-dim leading-[1.7] mb-4">
							Your team is already using AI tools like Claude and ChatGPT — but they can't access your
							business systems. We connect AI directly to your CRM, accounts, project tools, and data
							using the Model Context Protocol, so your AI actually does work, not just answers questions.
						</p>
						<p className="text-[0.9rem] text-fg-dim leading-[1.6]">
							Most businesses are live within two weeks.{' '}
							<Link to="/ai-integration" className="text-accent no-underline hover:text-fg transition-colors">
								Learn more →
							</Link>
						</p>
					</div>

					<div className="bg-surface border border-border p-8 transition-colors hover:border-accent">
						<h3 className="font-serif font-normal text-[1.3rem] mb-2">DODAR Workshops</h3>
						<p className="text-[0.95rem] text-fg-dim leading-[1.7] mb-4">
							Better decisions, faster. Our half-day workshops teach your team a structured decision-making
							framework from aviation — used in cockpits where the stakes are life and death. Walk away
							with a repeatable process your team can use every day.
						</p>
						<p className="text-[0.9rem] text-fg-dim leading-[1.6]">
							Up to 15 participants, remote or on-site. Includes templates, facilitation guide, and written debrief.
						</p>
					</div>
				</div>
			</section>

			{/* Why Crox */}
			<section className="py-16 border-b border-border">
				<div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim mb-8 flex items-center gap-4">
					Why Crox
					<span className="flex-1 h-px bg-border" />
				</div>

				<div className="space-y-10">
					<div>
						<h3 className="font-serif font-normal text-[1.3rem] mb-2">A decade in regulated industries.</h3>
						<p className="text-[0.95rem] text-fg-dim leading-[1.7]">
							We've shipped AI products in healthcare, legal tech, fintech, and insurance — sectors where
							compliance isn't optional and getting it wrong has real consequences. That experience shapes
							everything we do.
						</p>
					</div>

					<div>
						<h3 className="font-serif font-normal text-[1.3rem] mb-2">Decision-making rigour from aviation.</h3>
						<p className="text-[0.95rem] text-fg-dim leading-[1.7]">
							Our founder is a former commercial pilot. The DODAR framework we use — Diagnose, Options,
							Decide, Action, Review — comes from Crew Resource Management. It means we think before we
							build, and we build what actually matters.
						</p>
					</div>

					<div>
						<h3 className="font-serif font-normal text-[1.3rem] mb-2">Technical depth, business language.</h3>
						<p className="text-[0.95rem] text-fg-dim leading-[1.7]">
							We speak both. Your board gets a clear recommendation. Your dev team gets architecture that
							works. Nobody gets jargon they don't need.
						</p>
					</div>
				</div>
			</section>

			{/* What People Say */}
			<section className="py-16 border-b border-border">
				<div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim mb-8 flex items-center gap-4">
					What people say
					<span className="flex-1 h-px bg-border" />
				</div>

				<div className="space-y-6">
					{testimonials.map((t) => (
						<div key={t.name} className="border-l-2 border-accent pl-6 py-1">
							<p className="font-serif text-[1.1rem] text-fg leading-[1.5] mb-2">
								"{t.quote}"
							</p>
							<p className="text-[0.9rem]">
								<span className="text-fg-dim">— {t.name}, {t.role}</span>
							</p>
						</div>
					))}
				</div>
			</section>

			{/* From the Founder */}
			<section className="py-16 border-b border-border">
				<div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim mb-8 flex items-center gap-4">
					From the founder
					<span className="flex-1 h-px bg-border" />
				</div>

				<p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-4">
					Crox was founded by Adam Field — a product leader, former commercial pilot, and builder who's
					spent a decade shipping products where compliance is mandatory and safety is critical.
				</p>
				<Link to="/about" className="text-[0.95rem] text-accent no-underline hover:text-fg transition-colors">
					More about Adam and why Crox exists →
				</Link>
			</section>

			{/* Let's Talk */}
			<section className="py-24">
				<h2 className="font-serif font-normal text-[2rem] leading-[1.2] mb-6 max-sm:text-[1.6rem]">
					Let's <em className="italic text-accent">talk.</em>
				</h2>
				<p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-10">
					Whether you're building an AI product, connecting AI to your business tools, or want your team
					making better decisions — we'd like to hear what you're working on.
				</p>
				<div className="flex gap-6 items-center max-sm:flex-col max-sm:items-start">
					<a
						href={BOOKING_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-block font-mono text-[0.8rem] font-medium tracking-[0.15em] uppercase text-fg bg-accent px-10 py-4 transition-all hover:bg-[#c4472e] hover:-translate-y-px no-underline"
					>
						Book a free discovery call →
					</a>
					<a
						href="mailto:adam@crox.io"
						className="text-[0.95rem] text-fg no-underline border-b border-border pb-px hover:border-accent transition-colors"
					>
						adam@crox.io →
					</a>
				</div>
			</section>
		</>
	);
}
