import { useState } from 'react';

interface FaqItem {
  q: string;
  a: string;
}

interface FaqAccordionProps {
  faqs: FaqItem[];
}

export default function FaqAccordion({ faqs }: FaqAccordionProps) {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div>
      {faqs.map((faq, i) => (
        <div key={i} className="border-b border-border">
          <button
            onClick={() => setOpenFaq(openFaq === i ? null : i)}
            aria-expanded={openFaq === i}
            aria-controls={`faq-answer-${i}`}
            className="w-full py-5 flex justify-between items-center gap-4 text-left cursor-pointer bg-transparent border-0"
          >
            <span className="font-serif text-[1.1rem] text-fg">{faq.q}</span>
            <span
              aria-hidden="true"
              className="text-fg-dim text-[1.2rem] shrink-0 transition-transform"
              style={{ transform: openFaq === i ? 'rotate(45deg)' : 'none' }}
            >
              +
            </span>
          </button>
          <div
            id={`faq-answer-${i}`}
            role="region"
            aria-labelledby={`faq-question-${i}`}
            hidden={openFaq !== i}
          >
            {openFaq === i && (
              <p className="text-[0.95rem] text-fg-dim leading-[1.7] pb-6 pr-8">
                {faq.a}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
