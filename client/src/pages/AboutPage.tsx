import { Helmet } from 'react-helmet-async';

export default function AboutPage() {
	return (
		<>
			<Helmet>
				<title>About Adam Field — AI Product Leader, Former Commercial Pilot | Crox</title>
				<meta name="description" content="Adam Field: 10+ years building AI in regulated industries. Former Ryanair pilot, Babylon Health AI PM, Head of Product at SideLight AI. BSc Software Engineering, First Class." />
				<link rel="canonical" href="https://crox.io/about" />
				<meta property="og:title" content="About Adam Field — AI Product Leader | Crox" />
				<meta property="og:description" content="From the flight deck to the product floor. 10+ years shipping AI in healthcare, legal, insurance, and fintech." />
				<meta property="og:url" content="https://crox.io/about" />
				<meta property="og:type" content="profile" />
				<meta property="og:image" content="https://crox.io/og.png" />
				<meta name="twitter:card" content="summary_large_image" />
				<meta name="twitter:title" content="About Adam Field — AI Product Leader | Crox" />
				<meta name="twitter:description" content="From the flight deck to the product floor. 10+ years shipping AI in regulated industries." />
				<meta name="twitter:image" content="https://crox.io/og.png" />
			</Helmet>

			{/* Hero */}
			<div className="py-24 pb-16 border-b border-border">
				<div className="text-[0.65rem] tracking-[0.2em] uppercase text-accent mb-6">About</div>
				<h1 className="font-serif font-normal text-[2.8rem] leading-[1.15] mb-8">
					From the flight deck to the product floor.
				</h1>
				<p className="text-[0.95rem] text-fg-dim max-w-[580px] leading-[1.8]">
					Builder, founder and AI product leader with 10+ years building and deploying machine learning
					systems in highly regulated environments. Launched the UK's first BSI-audited AI clinical
					chatbot across 12 countries. Built ML risk stratification models that reduced NHS readmissions
					by 35%. Now focused on helping startups build responsibly and effectively with frontier AI systems.
				</p>
			</div>

			{/* Career arc */}
			<section className="py-16 border-b border-border">
				<div className="text-[0.65rem] tracking-[0.2em] uppercase text-fg-dim mb-8 flex items-center gap-4">
					Career arc
					<span className="flex-1 h-px bg-border" />
				</div>

				<div className="space-y-8">
					<div className="grid grid-cols-[140px_1fr] gap-6 items-baseline max-sm:grid-cols-1 max-sm:gap-1">
						<span className="text-[0.75rem] text-fg-dim tracking-[0.05em]">2022 – present</span>
						<div>
							<h3 className="font-serif font-normal text-[1.3rem] mb-1">Head of Product, SideLight AI</h3>
							<p className="text-[0.8rem] text-fg-dim leading-[1.6]">
								Early-stage AI company building medical and medical-legal AI systems. Led zero-to-one
								development of multiple AI prototypes for clinical documentation, evidence review, and
								workflow automation. Delivered live pilots with Tier 1 and Tier 2 law firms.
							</p>
						</div>
					</div>

					<div className="grid grid-cols-[140px_1fr] gap-6 items-baseline max-sm:grid-cols-1 max-sm:gap-1">
						<span className="text-[0.75rem] text-fg-dim tracking-[0.05em]">2020 – 2022</span>
						<div>
							<h3 className="font-serif font-normal text-[1.3rem] mb-1">Lead Product Manager, Health Navigator</h3>
							<p className="text-[0.8rem] text-fg-dim leading-[1.6]">
								AI risk stratification and clinical coaching platform for NHS trusts. Reduced unplanned
								readmissions by 35% through targeted AI intervention. Designed analytics dashboards and
								feedback loops improving model performance.
							</p>
						</div>
					</div>

					<div className="grid grid-cols-[140px_1fr] gap-6 items-baseline max-sm:grid-cols-1 max-sm:gap-1">
						<span className="text-[0.75rem] text-fg-dim tracking-[0.05em]">2018 – 2020</span>
						<div>
							<h3 className="font-serif font-normal text-[1.3rem] mb-1">Product Manager, Forward Partners</h3>
							<p className="text-[0.8rem] text-fg-dim leading-[1.6]">
								Hands-on with early-stage startups from idea to traction. Built and scaled Forward Advances,
								an automated revenue-based finance product. Reduced credit decision time from two weeks to
								two days.
							</p>
						</div>
					</div>

					<div className="grid grid-cols-[140px_1fr] gap-6 items-baseline max-sm:grid-cols-1 max-sm:gap-1">
						<span className="text-[0.75rem] text-fg-dim tracking-[0.05em]">2017 – 2018</span>
						<div>
							<h3 className="font-serif font-normal text-[1.3rem] mb-1">AI Product Manager, Babylon Health</h3>
							<p className="text-[0.8rem] text-fg-dim leading-[1.6]">
								Led product development for Babylon's AI clinical triage chatbot. Launched the UK's first
								BSI-audited AI clinical chatbot across 12 countries. Shipped under ISO 13485, MDR and
								DCB 0129 compliance.
							</p>
						</div>
					</div>

					<div className="grid grid-cols-[140px_1fr] gap-6 items-baseline max-sm:grid-cols-1 max-sm:gap-1">
						<span className="text-[0.75rem] text-fg-dim tracking-[0.05em]">2013 – 2017</span>
						<div>
							<h3 className="font-serif font-normal text-[1.3rem] mb-1">Technical Project Manager, Potato (WPP)</h3>
							<p className="text-[0.8rem] text-fg-dim leading-[1.6]">
								Delivered multiple projects for Google and Saatchi & Saatchi. $2M redesign of the Android
								Developers site. Won two FWA awards.
							</p>
						</div>
					</div>

					<div className="grid grid-cols-[140px_1fr] gap-6 items-baseline max-sm:grid-cols-1 max-sm:gap-1">
						<span className="text-[0.75rem] text-fg-dim tracking-[0.05em]">2002 – 2013</span>
						<div>
							<h3 className="font-serif font-normal text-[1.3rem] mb-1">Commercial Pilot, Ryanair</h3>
							<p className="text-[0.8rem] text-fg-dim leading-[1.6]">
								737 fleet. Crew Resource Management, systems thinking under pressure, and the operational
								discipline that still runs through everything I build.
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Education */}
			<section className="py-16 border-b border-border">
				<div className="text-[0.65rem] tracking-[0.2em] uppercase text-fg-dim mb-8 flex items-center gap-4">
					Education
					<span className="flex-1 h-px bg-border" />
				</div>

				<div className="space-y-4">
					<div className="flex justify-between items-baseline border-b border-border pb-4 gap-4 max-sm:flex-col max-sm:gap-1">
						<span className="font-serif text-[1rem] text-fg">BSc Software Engineering, First Class</span>
						<span className="text-[0.75rem] text-fg-dim whitespace-nowrap">Middlesex University, 2014</span>
					</div>
					<div className="flex justify-between items-baseline border-b border-border pb-4 gap-4 max-sm:flex-col max-sm:gap-1">
						<span className="font-serif text-[1rem] text-fg">Sustainable Business Management</span>
						<span className="text-[0.75rem] text-fg-dim whitespace-nowrap">University of Cambridge, 2023</span>
					</div>
					<div className="flex justify-between items-baseline border-b border-border pb-4 gap-4 max-sm:flex-col max-sm:gap-1">
						<span className="font-serif text-[1rem] text-fg">Storytelling for Influence</span>
						<span className="text-[0.75rem] text-fg-dim whitespace-nowrap">IDEO, 2021</span>
					</div>
					<div className="flex justify-between items-baseline gap-4 max-sm:flex-col max-sm:gap-1">
						<span className="font-serif text-[1rem] text-fg">Commercial Pilots License</span>
						<span className="text-[0.75rem] text-fg-dim whitespace-nowrap">Oxford Aviation, 2002</span>
					</div>
				</div>
			</section>

			{/* Contact */}
			<section className="py-16">
				<div className="text-[0.65rem] tracking-[0.2em] uppercase text-fg-dim mb-8 flex items-center gap-4">
					Get in touch
					<span className="flex-1 h-px bg-border" />
				</div>

				<div className="grid grid-cols-2 gap-8 max-sm:grid-cols-1">
					<div className="text-[0.8rem]">
						<div className="text-[0.65rem] tracking-[0.15em] uppercase text-fg-dim mb-2">Email</div>
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
