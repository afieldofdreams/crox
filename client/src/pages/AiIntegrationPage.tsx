import { useState } from 'react';
import { Helmet } from 'react-helmet-async';

const BOOKING_URL = 'https://calendar.app.google/3avUXyXnctfWpyHF7';

const faqs = [
	{
		q: 'Do we need technical staff to use this?',
		a: "No. We handle all the technical work. Your team just uses AI the way they already do — it'll just be able to do much more.",
	},
	{
		q: 'What AI tools does this work with?',
		a: "Claude, ChatGPT, Microsoft Copilot, Gemini, and most other AI assistants that support the Model Context Protocol. We'll advise on the best fit for your business.",
	},
	{
		q: 'Is our data safe?',
		a: "Yes. Connections run in your own environment — your data doesn't pass through our servers. For regulated industries, we configure access controls so AI can only see what it should.",
	},
	{
		q: 'How long does setup take?',
		a: 'Most standard connections are live within two weeks. Custom builds typically take four to six weeks depending on complexity.',
	},
	{
		q: "What if it doesn't work for us?",
		a: "The discovery call is free and the recommendation is honest. If we don't think AI integration will save you meaningful time or money, we'll tell you.",
	},
];

export default function AiIntegrationPage() {
	const [openFaq, setOpenFaq] = useState<number | null>(null);

	return (
		<>
			<Helmet>
				<title>AI Integration for Small Business | Connect AI to Your Tools | Crox</title>
				<meta name="description" content="Your team uses AI but it can't access your business tools. We connect AI assistants to your CRM, accounts, project tools, and data — so they actually work. Fast setup for SMEs." />
				<meta name="robots" content="index, follow, max-snippet:-1, max-image-preview:large" />
				<link rel="canonical" href="https://crox.io/ai-integration" />
				<meta property="og:title" content="AI Integration for Small Business | Connect AI to Your Tools" />
				<meta property="og:description" content="We connect AI assistants to your CRM, accounts, project tools, and data — so they actually work. Fast setup for SMEs." />
				<meta property="og:url" content="https://crox.io/ai-integration" />
				<meta property="og:type" content="website" />
				<meta property="og:site_name" content="Crox" />
				<meta property="og:image" content="https://crox.io/og.png" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="AI Integration for Small Business | Connect AI to Your Tools" />
				<meta name="twitter:description" content="We connect AI assistants to your CRM, accounts, project tools, and data — so they actually work." />
				<meta name="twitter:image" content="https://crox.io/og.png" />
				<script type="application/ld+json">{JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'Service',
					name: 'AI Integration for Small Business',
					description: 'Connect AI assistants to your CRM, accounting software, project tools, and data using the Model Context Protocol.',
					provider: { '@type': 'Organization', name: 'Crox', url: 'https://crox.io' },
					url: 'https://crox.io/ai-integration',
					areaServed: 'GB',
				})}</script>
				<script type="application/ld+json">{JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'FAQPage',
					mainEntity: faqs.map(faq => ({
						'@type': 'Question',
						name: faq.q,
						acceptedAnswer: { '@type': 'Answer', text: faq.a },
					})),
				})}</script>
				<script type="application/ld+json">{JSON.stringify({
					'@context': 'https://schema.org',
					'@type': 'BreadcrumbList',
					itemListElement: [
						{ '@type': 'ListItem', position: 1, name: 'Home', item: 'https://crox.io' },
						{ '@type': 'ListItem', position: 2, name: 'AI Integration', item: 'https://crox.io/ai-integration' },
					],
				})}</script>
			</Helmet>

			{/* Hero */}
			<div className="py-24 pb-16 border-b border-border">
				<h1 className="font-serif font-normal text-[3.2rem] leading-[1.15] mb-8 max-sm:text-[2.2rem]">
					Your AI Doesn't Know<br />Your <em className="italic text-accent">Business.</em>
				</h1>
				<div className="text-[0.95rem] text-fg-dim leading-[1.8] space-y-4">
					<p>
						Your team is already using AI. But every time someone copies data out of your CRM, your
						accounts software, or your project tools and pastes it into ChatGPT, that's time wasted
						and context lost.
					</p>
					<p className="text-fg">
						We connect your AI to the tools you already use. No copying. No pasting. No middleman.
					</p>
				</div>
				<a
					href={BOOKING_URL}
					target="_blank"
					rel="noopener noreferrer"
					className="inline-block mt-10 font-mono text-[0.8rem] font-medium tracking-[0.15em] uppercase text-fg bg-accent px-10 py-4 transition-all hover:bg-[#c4472e] hover:-translate-y-px no-underline"
				>
					Book a free discovery call →
				</a>
			</div>

			{/* How It Works */}
			<section className="py-16 border-b border-border">
				<div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim mb-8 flex items-center gap-4">
					How it works
					<span className="flex-1 h-px bg-border" />
				</div>

				<h2 className="font-serif font-normal text-[1.6rem] mb-6 max-sm:text-[1.3rem]">
					We connect your AI to the tools you already use.
				</h2>
				<div className="text-[0.95rem] text-fg-dim leading-[1.8] space-y-4">
					<p>
						There's a new open standard called the Model Context Protocol — backed by the companies
						behind ChatGPT, Claude, Copilot, and Gemini — that lets AI assistants talk directly to
						your business software. One connection method, every tool. No fragile workarounds that
						break when something updates.
					</p>
					<p>
						What that means for you: your AI assistant can access Xero, HubSpot, Salesforce, Slack,
						Google Workspace, your databases, your internal tools — whatever your business runs on.
						Securely, reliably, and looked after by us.
					</p>
					<p className="text-fg">You don't need to understand how it works. You just need to know that it does.</p>
				</div>
			</section>

			{/* What You Get */}
			<section className="py-16 border-b border-border">
				<div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim mb-8 flex items-center gap-4">
					What you get
					<span className="flex-1 h-px bg-border" />
				</div>

				<div className="grid gap-6">
					<div className="bg-surface border border-border p-8 transition-colors hover:border-accent">
						<h3 className="font-serif font-normal text-[1.3rem] mb-2">Connect</h3>
						<p className="text-[0.95rem] text-fg-dim leading-[1.7] mb-4">
							We look at what tools your team uses, where the biggest time drains are, and connect
							your AI to the systems that matter most. Most businesses are up and running within two weeks.
						</p>
						<p className="text-[0.95rem] text-fg font-mono">Starting from £2,500</p>
					</div>

					<div className="bg-surface border border-border p-8 transition-colors hover:border-accent">
						<h3 className="font-serif font-normal text-[1.3rem] mb-2">Build</h3>
						<p className="text-[0.95rem] text-fg-dim leading-[1.7] mb-4">
							Got internal tools, a proprietary database, or industry-specific software? We build
							custom connections so your AI can access the systems that off-the-shelf solutions can't reach.
						</p>
						<p className="text-[0.95rem] text-fg font-mono">Starting from £5,000</p>
					</div>

					<div className="bg-surface border border-border p-8 transition-colors hover:border-accent">
						<h3 className="font-serif font-normal text-[1.3rem] mb-2">Support</h3>
						<p className="text-[0.95rem] text-fg-dim leading-[1.7] mb-4">
							Things change — new tools, new team members, new needs. We maintain your connections,
							monitor for issues, and expand your setup as your business grows. Monthly retainer, cancel anytime.
						</p>
						<p className="text-[0.95rem] text-fg font-mono">From £500/month</p>
					</div>
				</div>
			</section>

			{/* Who This Is For */}
			<section className="py-16 border-b border-border">
				<div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim mb-8 flex items-center gap-4">
					Who this is for
					<span className="flex-1 h-px bg-border" />
				</div>

				<div className="text-[0.95rem] text-fg-dim leading-[1.8] space-y-4">
					<p>
						This is for small and mid-sized businesses — typically 10 to 200 people — who are already
						using AI tools and want them to actually do work, not just answer questions.
					</p>
					<p>You might be:</p>
				</div>
				<ul className="mt-4 space-y-3">
					<li className="text-[0.95rem] text-fg-dim leading-[1.7] pl-4 border-l-2 border-accent">
						A founder who's seen what AI can do but can't get it to work with your actual business systems
					</li>
					<li className="text-[0.95rem] text-fg-dim leading-[1.7] pl-4 border-l-2 border-accent">
						An operations lead who's tired of your team manually feeding data into AI tools
					</li>
					<li className="text-[0.95rem] text-fg-dim leading-[1.7] pl-4 border-l-2 border-accent">
						A managing director in a regulated industry (healthcare, legal, finance, insurance) who needs AI access to be controlled and auditable
					</li>
				</ul>
				<p className="text-[0.95rem] text-fg mt-6 leading-[1.8]">
					If your team is spending time being the middleman between AI and your tools, we can fix that.
				</p>
			</section>

			{/* How We Work Together */}
			<section className="py-16 border-b border-border">
				<div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim mb-8 flex items-center gap-4">
					How we work together
					<span className="flex-1 h-px bg-border" />
				</div>

				<div className="space-y-10">
					<div className="grid grid-cols-[40px_1fr] gap-4 items-start max-sm:grid-cols-1 max-sm:gap-1">
						<span className="text-[1.3rem] font-serif text-accent leading-[1.3]">1.</span>
						<div>
							<h3 className="font-serif font-normal text-[1.3rem] leading-[1.3] mb-2">Discovery call (free, 30 minutes)</h3>
							<p className="text-[0.95rem] text-fg-dim leading-[1.7]">
								We learn about your business, your tools, and where AI could save the most time.
								No sales pitch — just an honest conversation about whether this makes sense for you.
							</p>
						</div>
					</div>

					<div className="grid grid-cols-[40px_1fr] gap-4 items-start max-sm:grid-cols-1 max-sm:gap-1">
						<span className="text-[1.3rem] font-serif text-accent leading-[1.3]">2.</span>
						<div>
							<h3 className="font-serif font-normal text-[1.3rem] leading-[1.3] mb-2">Recommendation</h3>
							<p className="text-[0.95rem] text-fg-dim leading-[1.7]">
								We come back with a clear proposal: what to connect, in what order, what it costs,
								and how long it takes. No surprises.
							</p>
						</div>
					</div>

					<div className="grid grid-cols-[40px_1fr] gap-4 items-start max-sm:grid-cols-1 max-sm:gap-1">
						<span className="text-[1.3rem] font-serif text-accent leading-[1.3]">3.</span>
						<div>
							<h3 className="font-serif font-normal text-[1.3rem] leading-[1.3] mb-2">Implementation</h3>
							<p className="text-[0.95rem] text-fg-dim leading-[1.7]">
								We build and test everything in your environment. Your team doesn't need to do anything technical.
							</p>
						</div>
					</div>

					<div className="grid grid-cols-[40px_1fr] gap-4 items-start max-sm:grid-cols-1 max-sm:gap-1">
						<span className="text-[1.3rem] font-serif text-accent leading-[1.3]">4.</span>
						<div>
							<h3 className="font-serif font-normal text-[1.3rem] leading-[1.3] mb-2">Handover and support</h3>
							<p className="text-[0.95rem] text-fg-dim leading-[1.7]">
								Your team gets a plain-English walkthrough of what's been set up. Documentation is provided.
								Ongoing support is available if you want it.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* FAQ */}
			<section className="py-16 border-b border-border">
				<div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim mb-8 flex items-center gap-4">
					Frequently asked questions
					<span className="flex-1 h-px bg-border" />
				</div>

				<div>
					{faqs.map((faq, i) => (
						<div key={i} className="border-b border-border">
							<button
								onClick={() => setOpenFaq(openFaq === i ? null : i)}
								className="w-full py-5 flex justify-between items-center gap-4 text-left cursor-pointer bg-transparent border-0"
							>
								<span className="font-serif text-[1.1rem] text-fg">{faq.q}</span>
								<span className="text-fg-dim text-[1.2rem] shrink-0 transition-transform" style={{ transform: openFaq === i ? 'rotate(45deg)' : 'none' }}>
									+
								</span>
							</button>
							{openFaq === i && (
								<p className="text-[0.95rem] text-fg-dim leading-[1.7] pb-6 pr-8">
									{faq.a}
								</p>
							)}
						</div>
					))}
				</div>
			</section>

			{/* Bottom CTA */}
			<section className="py-24">
				<h2 className="font-serif font-normal text-[2rem] leading-[1.2] mb-6 max-sm:text-[1.6rem]">
					Ready to make your AI<br />actually <em className="italic text-accent">useful?</em>
				</h2>
				<p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-10">
					Book a free 30-minute discovery call. We'll look at your tools, your workflows, and tell
					you honestly whether AI integration makes sense for your business.
				</p>
				<div className="flex gap-6 items-center max-sm:flex-col max-sm:items-start">
					<a
						href={BOOKING_URL}
						target="_blank"
						rel="noopener noreferrer"
						className="inline-block font-mono text-[0.8rem] font-medium tracking-[0.15em] uppercase text-fg bg-accent px-10 py-4 transition-all hover:bg-[#c4472e] hover:-translate-y-px no-underline"
					>
						Book a discovery call →
					</a>
					<a
						href="mailto:adam@crox.io"
						className="text-[0.95rem] text-fg no-underline border-b border-border pb-px hover:border-accent transition-colors"
					>
						Email us: adam@crox.io →
					</a>
				</div>
			</section>
		</>
	);
}
