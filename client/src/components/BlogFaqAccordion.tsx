import { useState } from 'react';

interface FAQItem {
  question: string;
  answer: string;
}

interface BlogFaqAccordionProps {
  faqs: FAQItem[];
}

export default function BlogFaqAccordion({ faqs }: BlogFaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <div key={index} className="border border-border">
          <button
            id={`blog-faq-q-${index}`}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            aria-expanded={openIndex === index}
            aria-controls={`blog-faq-a-${index}`}
            className="w-full px-6 py-4 flex justify-between items-start hover:bg-surface/50 transition-colors"
          >
            <span className="text-[0.95rem] text-fg text-left font-medium">{faq.question}</span>
            <span aria-hidden="true" className="ml-4 text-fg-dim flex-shrink-0">
              {openIndex === index ? '\u2212' : '+'}
            </span>
          </button>
          <div
            id={`blog-faq-a-${index}`}
            role="region"
            aria-labelledby={`blog-faq-q-${index}`}
            hidden={openIndex !== index}
          >
            {openIndex === index && (
              <div className="border-t border-border px-6 py-4 bg-surface/30">
                <p className="text-[0.9rem] text-fg-dim leading-[1.6]">{faq.answer}</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
