import { Helmet } from 'react-helmet-async';

const BOOKING_URL = 'https://calendar.app.google/3avUXyXnctfWpyHF7';

export default function AboutPage() {
	return (
		<>
			<Helmet>
				<title>About Crox | Founded by Adam Field</title>
				<meta name="description" content="Crox was founded by Adam Field — a product leader, former commercial pilot, and builder with a decade of experience helping organisations ship AI products in regulated industries." />
				<link rel="canonical" href="https://crox.io/about" />
				<meta property="og:title" content="About Crox | Founded by Adam Field" />
				<meta property="og:description" content="Crox was founded by Adam Field — a product leader, former commercial pilot, and builder with a decade of experience shipping AI in regulated industries." />
				<meta property="og:url" content="https://crox.io/about" />
				<meta property="og:type" content="profile" />
				<meta property="og:image" content="https://crox.io/og.png" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="About Crox | Founded by Adam Field" />
				<meta name="twitter:description" content="Crox was founded by Adam Field — a product leader, former commercial pilot, and builder with a decade of experience shipping AI in regulated industries." />
				<meta name="twitter:image" content="https://crox.io/og.png" />
			</Helmet>

			{/* Hero */}
			<div className="py-24 pb-16 border-b border-border">
				<div className="text-[0.7rem] tracking-[0.2em] uppercase text-accent mb-6">About</div>
				<h1 className="font-serif font-normal text-[2.8rem] leading-[1.15] mb-8 max-sm:text-[2rem]">
					Built by someone who's shipped it <em className="italic text-accent">before.</em>
				</h1>
				<p className="text-[1rem] text-fg-dim leading-[1.8]">
					Crox was founded by Adam Field. Product leader, former commercial pilot, and builder. A decade
					spent shipping products in healthcare, legal tech, fintech, and insurance — industries where
					you can't afford to get it wrong.
				</p>
			</div>

			{/* The Story */}
			<section className="py-16 border-b border-border">
				<div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim mb-8 flex items-center gap-4">
					The story
					<span className="flex-1 h-px bg-border" />
				</div>

				<div className="text-[0.95rem] text-fg-dim leading-[1.8] space-y-6">
					<p className="text-fg">I started Crox because I kept seeing the same thing.</p>
					<p>
						Small businesses with real potential — smart teams, good products, growing fast — being left
						behind in the AI shift. Not because they didn't want to use AI, but because nobody was helping
						them do it properly. The big consultancies don't talk to companies with 20 people. The freelancers
						don't have the depth. And the AI hype machine makes it nearly impossible to tell what's real
						from what's noise.
					</p>
					<p>
						I've spent my career in the gap between technology and decisions that matter. As a commercial
						pilot, I learned structured decision-making in environments where the stakes are life and
						death — that's where the DODAR framework comes from. In product leadership, I shipped AI in
						some of the most regulated industries there are. I've seen what works, what fails, and what
						gets people into trouble.
					</p>
					<p>
						Crox exists to bring that experience to the businesses that need it most — the ones too small
						for a big consultancy and too ambitious to figure it out alone.
					</p>
				</div>
			</section>

			{/* Where I've Worked */}
			<section className="py-16 border-b border-border">
				<div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim mb-8 flex items-center gap-4">
					Where I've worked
					<span className="flex-1 h-px bg-border" />
				</div>

				<div className="space-y-10">
					<div>
						<h3 className="font-serif font-normal text-[1.3rem] mb-2">Head of Product — SideLight AI</h3>
						<p className="text-[0.95rem] text-fg-dim leading-[1.7]">
							Leading product for an AI company, shaping strategy and shipping features across the product lifecycle.
						</p>
					</div>

					<div>
						<h3 className="font-serif font-normal text-[1.3rem] mb-2">Babylon Health</h3>
						<p className="text-[0.95rem] text-fg-dim leading-[1.7]">
							Built AI products in healthcare at scale — one of the most regulated, highest-stakes environments
							in tech. Navigated compliance, clinical governance, and the reality of deploying AI where
							mistakes affect patients.
						</p>
					</div>

					<div>
						<h3 className="font-serif font-normal text-[1.3rem] mb-2">Ryanair</h3>
						<p className="text-[0.95rem] text-fg-dim leading-[1.7]">
							Former commercial pilot. This is where structured decision-making became instinct. Crew
							Resource Management, DODAR, high-pressure environments with zero margin for error. I bring
							this discipline to every engagement.
						</p>
					</div>

					<div>
						<h3 className="font-serif font-normal text-[1.3rem] mb-2">University of Cambridge</h3>
						<p className="text-[0.95rem] text-fg-dim leading-[1.7]">
							Foundation in rigorous thinking and structured analysis.
						</p>
					</div>
				</div>
			</section>

			{/* What I Bring to Crox */}
			<section className="py-16 border-b border-border">
				<div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim mb-8 flex items-center gap-4">
					What I bring to Crox
					<span className="flex-1 h-px bg-border" />
				</div>

				<div className="space-y-10">
					<div>
						<h3 className="font-serif font-normal text-[1.3rem] mb-2">Regulated industry depth.</h3>
						<p className="text-[0.95rem] text-fg-dim leading-[1.7]">
							Healthcare, legal, fintech, insurance. I've shipped products in all of them. I know how
							compliance works in practice, not just in theory — and I know how to make AI work within
							those constraints.
						</p>
					</div>

					<div>
						<h3 className="font-serif font-normal text-[1.3rem] mb-2">Product thinking, not just technical delivery.</h3>
						<p className="text-[0.95rem] text-fg-dim leading-[1.7]">
							I don't just build things. I help you decide what to build, in what order, and why. That
							means asking the hard questions before writing any code.
						</p>
					</div>

					<div>
						<h3 className="font-serif font-normal text-[1.3rem] mb-2">The DODAR framework.</h3>
						<p className="text-[0.95rem] text-fg-dim leading-[1.7]">
							Diagnose, Options, Decide, Action, Review. Borrowed from the cockpit, applied to business.
							Every engagement starts with understanding the problem properly — not jumping to the first
							solution that feels right.
						</p>
					</div>

					<div>
						<h3 className="font-serif font-normal text-[1.3rem] mb-2">Plain speaking.</h3>
						<p className="text-[0.95rem] text-fg-dim leading-[1.7]">
							I explain things clearly. No jargon, no hand-waving, no hiding behind complexity. You'll
							always know what we're doing and why.
						</p>
					</div>
				</div>
			</section>

			{/* Beyond Work */}
			<section className="py-16 border-b border-border">
				<div className="text-[0.7rem] tracking-[0.2em] uppercase text-fg-dim mb-8 flex items-center gap-4">
					Beyond work
					<span className="flex-1 h-px bg-border" />
				</div>

				<p className="text-[0.95rem] text-fg-dim leading-[1.8]">
					Based in London. Father to Oscar and Ottilie, married to Cressie, and regularly outwitted by
					Mango the dog. I write about AI, product strategy, and systems thinking on{' '}
					<a href="https://www.linkedin.com/in/afieldio" target="_blank" rel="noopener noreferrer" className="text-fg no-underline border-b border-border pb-px hover:border-accent transition-colors">
						LinkedIn
					</a>{' '}
					and{' '}
					<a href="https://substack.com/@adamfield" target="_blank" rel="noopener noreferrer" className="text-fg no-underline border-b border-border pb-px hover:border-accent transition-colors">
						Substack
					</a>.
				</p>
			</section>

			{/* Let's Work Together */}
			<section className="py-24">
				<h2 className="font-serif font-normal text-[2rem] leading-[1.2] mb-6 max-sm:text-[1.6rem]">
					Let's work <em className="italic text-accent">together.</em>
				</h2>
				<p className="text-[0.95rem] text-fg-dim leading-[1.8] mb-10">
					If you're running a small business and want to get serious about AI — whether that's connecting
					it to your tools, building it into your product, or just figuring out where to start — I'd love
					to hear what you're working on.
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
