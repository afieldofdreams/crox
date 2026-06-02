// Floating chat widget on every page.
//
// Flow:
//   1. Visitor opens the widget → sees an intro form asking name + email.
//   2. Submits → POST /chat/start creates a conversation row in Postgres,
//      returns conversation_id + a greeting that Fred would open with.
//   3. Subsequent messages POST to /chat with conversation_id + visitor
//      identity so the server persists each turn and Fred can greet by
//      name without re-asking.
//   4. When the conversation produces enough to warrant a CRM record,
//      Fred drops the Google Calendar link and the widget will POST
//      /capture in the background to push to flight-deck/Fibery. We
//      also fire /capture explicitly when the user clicks the link, so
//      Adam sees the chat before the call.
//
// Identity: reads window.croxAttribution (set by flight-deck/track.js)
// to pass visitor_id and contact_ref through. Works fine without
// either — the server synthesises a visitor_id and creates a new
// contact if none matches.

import { useEffect, useMemo, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

type Role = 'user' | 'assistant';
type Message = { role: Role; content: string };

interface CroxAttribution {
  visitorId?: string;
  contactId?: string;
}

declare global {
  interface Window {
    croxAttribution?: CroxAttribution;
  }
}

interface Props {
  chatBaseUrl?: string;
}

const STORAGE_KEY = 'crox_chat_v2';
const DEFAULT_CHAT_BASE_URL = 'https://chat.crox.io';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const BOOKING_URL = 'https://calendar.app.google/dmmq9bdFyc11G8Km8';

interface StoredState {
  conversationId: number | null;
  name: string | null;
  email: string | null;
  messages: Message[];
  captureFired: boolean;
}

function emptyState(): StoredState {
  return { conversationId: null, name: null, email: null, messages: [], captureFired: false };
}

function loadStored(): StoredState {
  if (typeof window === 'undefined') return emptyState();
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return emptyState();
    const parsed = JSON.parse(raw) as Partial<StoredState>;
    return {
      conversationId: typeof parsed.conversationId === 'number' ? parsed.conversationId : null,
      name: typeof parsed.name === 'string' ? parsed.name : null,
      email: typeof parsed.email === 'string' ? parsed.email : null,
      messages: Array.isArray(parsed.messages) ? parsed.messages as Message[] : [],
      captureFired: Boolean(parsed.captureFired),
    };
  } catch {
    return emptyState();
  }
}

function persist(state: StoredState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore — localStorage may be disabled
  }
}

// Render an assistant message as constrained markdown.
//
// What's allowed: bold, italic, lists, paragraphs, inline code, line
// breaks, and autolinks (URLs typed bare become anchor tags). GFM is
// enabled so Fred can use `- bullet` and `**bold**` naturally.
//
// What's disallowed: raw HTML (skipHtml), images, headings (we map
// them to <p> so a stray ### doesn't blow up the layout). Links open
// in a new tab.
//
// All custom components are styled to match the surrounding chat
// design — small text, no extra spacing, accent-coloured links.
function MarkdownMessage({ content }: { content: string }) {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      skipHtml
      disallowedElements={['img']}
      components={{
        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
        a: ({ href, children }) => (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent underline underline-offset-2 hover:no-underline break-all"
          >
            {children}
          </a>
        ),
        ul: ({ children }) => <ul className="list-disc pl-5 mb-2 last:mb-0 space-y-1">{children}</ul>,
        ol: ({ children }) => <ol className="list-decimal pl-5 mb-2 last:mb-0 space-y-1">{children}</ol>,
        li: ({ children }) => <li>{children}</li>,
        code: ({ children }) => (
          <code className="font-mono text-[0.8rem] bg-bg px-1 py-0.5 rounded">{children}</code>
        ),
        pre: ({ children }) => (
          <pre className="font-mono text-[0.8rem] bg-bg p-2 rounded overflow-x-auto mb-2 last:mb-0">
            {children}
          </pre>
        ),
        // Flatten headings to bold paragraphs so a stray `## ` doesn't break the layout.
        h1: ({ children }) => <p className="font-semibold mb-2 last:mb-0">{children}</p>,
        h2: ({ children }) => <p className="font-semibold mb-2 last:mb-0">{children}</p>,
        h3: ({ children }) => <p className="font-semibold mb-2 last:mb-0">{children}</p>,
        h4: ({ children }) => <p className="font-semibold mb-2 last:mb-0">{children}</p>,
        strong: ({ children }) => <strong className="font-semibold">{children}</strong>,
        em: ({ children }) => <em className="italic">{children}</em>,
      }}
    >
      {content}
    </ReactMarkdown>
  );
}

export default function ChatWidget({ chatBaseUrl = DEFAULT_CHAT_BASE_URL }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [conversationId, setConversationId] = useState<number | null>(null);
  const [visitorName, setVisitorName] = useState<string | null>(null);
  const [visitorEmail, setVisitorEmail] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [captureFired, setCaptureFired] = useState(false);

  // Intro form draft state
  const [nameDraft, setNameDraft] = useState('');
  const [emailDraft, setEmailDraft] = useState('');
  const [introError, setIntroError] = useState<string | null>(null);
  const [introSubmitting, setIntroSubmitting] = useState(false);

  // Composer state
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  // Mirror of `messages` for use inside async callbacks (stream loop,
  // capture firing) where the closed-over state would otherwise be stale.
  const messagesRef = useRef<Message[]>([]);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    const s = loadStored();
    setConversationId(s.conversationId);
    setVisitorName(s.name);
    setVisitorEmail(s.email);
    setMessages(s.messages);
    setCaptureFired(s.captureFired);
  }, []);

  // Persist on any change and keep messagesRef in sync.
  useEffect(() => {
    messagesRef.current = messages;
    persist({
      conversationId,
      name: visitorName,
      email: visitorEmail,
      messages,
      captureFired,
    });
  }, [conversationId, visitorName, visitorEmail, messages, captureFired]);

  // Auto-scroll to bottom on new content.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  const introComplete = useMemo(() => Boolean(visitorName && visitorEmail), [visitorName, visitorEmail]);

  async function submitIntro() {
    const name = nameDraft.trim();
    const email = emailDraft.trim();
    if (!name) {
      setIntroError("What's your name?");
      return;
    }
    if (!EMAIL_RE.test(email)) {
      setIntroError("That doesn't look like an email. Try again?");
      return;
    }
    setIntroError(null);
    setIntroSubmitting(true);

    try {
      const resp = await fetch(`${chatBaseUrl}/chat/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          page_url: window.location.href,
          visitor_id: window.croxAttribution?.visitorId,
          contact_ref: window.croxAttribution?.contactId,
          user_agent: navigator.userAgent,
        }),
      });
      if (!resp.ok) {
        const detail = await resp.text().catch(() => '');
        throw new Error(`start_${resp.status}_${detail.slice(0, 40)}`);
      }
      const data = (await resp.json()) as { conversation_id: number | null; greeting: string };
      setConversationId(data.conversation_id);
      setVisitorName(name);
      setVisitorEmail(email);
      // Seed Fred's opening as the first assistant message. Streaming
      // starts when the visitor sends a reply.
      setMessages([{ role: 'assistant', content: data.greeting }]);
    } catch (err) {
      console.warn('[crox-chat] /chat/start failed:', err);
      setIntroError("Couldn't start the chat. Try again, or email adam@crox.io directly.");
    } finally {
      setIntroSubmitting(false);
    }
  }

  async function sendMessage(text: string) {
    if (!text.trim() || isStreaming || !introComplete) return;

    const userMsg: Message = { role: 'user', content: text.trim() };
    const next = [...messages, userMsg];
    setMessages(next);
    setInput('');
    setIsStreaming(true);

    const placeholderIndex = next.length;
    setMessages((m) => [...m, { role: 'assistant', content: '' }]);

    const controller = new AbortController();
    abortRef.current = controller;

    try {
      const resp = await fetch(`${chatBaseUrl}/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: next,
          contact_ref: window.croxAttribution?.contactId,
          conversation_id: conversationId,
          visitor_name: visitorName,
          visitor_email: visitorEmail,
        }),
        signal: controller.signal,
      });

      if (!resp.ok || !resp.body) {
        const detail = await resp.text().catch(() => '');
        throw new Error(`chat_failed_${resp.status}_${detail.slice(0, 40)}`);
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        const frames = buffer.split('\n\n');
        buffer = frames.pop() ?? '';

        for (const frame of frames) {
          const eventLine = frame.split('\n').find((l) => l.startsWith('event:'));
          const dataLine = frame.split('\n').find((l) => l.startsWith('data:'));
          if (!eventLine || !dataLine) continue;
          const event = eventLine.slice('event:'.length).trim();
          const data = dataLine.slice('data:'.length).trim();

          if (event === 'token') {
            try {
              const payload = JSON.parse(data) as { text: string };
              setMessages((current) => {
                const updated = [...current];
                const existing = updated[placeholderIndex];
                if (existing && existing.role === 'assistant') {
                  updated[placeholderIndex] = {
                    ...existing,
                    content: existing.content + payload.text,
                  };
                }
                return updated;
              });
            } catch {
              // ignore malformed frame
            }
          } else if (event === 'error') {
            setMessages((current) => {
              const updated = [...current];
              if (updated[placeholderIndex]?.role === 'assistant' && !updated[placeholderIndex].content) {
                updated[placeholderIndex] = {
                  role: 'assistant',
                  content: "Something went wrong on my end — give it another go in a moment.",
                };
              }
              return updated;
            });
          }
        }
      }

      // Fire /capture in the background once Fred has dropped the booking
      // link. This guarantees Adam gets the transcript pushed to Fibery
      // before the visitor clicks through to book.
      const finalReply = messagesRef.current[placeholderIndex]?.content ?? '';
      if (!captureFired && finalReply.includes(BOOKING_URL)) {
        void fireCapture();
      }
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setMessages((current) => {
        const updated = [...current];
        if (updated[placeholderIndex]?.role === 'assistant' && !updated[placeholderIndex].content) {
          updated[placeholderIndex] = {
            role: 'assistant',
            content: "I couldn't reach the server. Try again in a moment, or email adam@crox.io.",
          };
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  async function fireCapture() {
    if (captureFired || !visitorEmail) return;
    const snapshot = messagesRef.current;
    try {
      const resp = await fetch(`${chatBaseUrl}/capture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: visitorEmail,
          name: visitorName ?? undefined,
          page_url: window.location.href,
          visitor_id: window.croxAttribution?.visitorId,
          contact_ref: window.croxAttribution?.contactId,
          conversation: snapshot.filter((m) => m.content.trim().length > 0),
          conversation_id: conversationId,
        }),
      });
      if (!resp.ok) {
        const detail = await resp.text().catch(() => '');
        throw new Error(`capture_${resp.status}_${detail.slice(0, 40)}`);
      }
      setCaptureFired(true);
    } catch (err) {
      console.warn('[crox-chat] capture failed:', err);
      // Silent — Adam still has the raw conversation in Postgres.
    }
  }

  function resetConversation() {
    abortRef.current?.abort();
    setConversationId(null);
    setVisitorName(null);
    setVisitorEmail(null);
    setMessages([]);
    setCaptureFired(false);
    setNameDraft('');
    setEmailDraft('');
    setIntroError(null);
    setInput('');
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }

  return (
    <>
      {/* Floating launcher button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open chat with Fred"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-accent text-fg font-mono text-[0.75rem] tracking-[0.12em] uppercase px-5 py-3 shadow-lg hover:bg-[#c4472e] hover:-translate-y-px transition-all"
        >
          <span>Chat with Fred</span>
        </button>
      )}

      {/* Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Chat with Fred"
          className="fixed inset-0 z-50 flex flex-col w-full h-[100dvh] bg-surface sm:inset-auto sm:bottom-4 sm:right-4 sm:w-[min(420px,calc(100vw-2rem))] sm:h-[min(640px,calc(100vh-2rem))] sm:border sm:border-border sm:shadow-2xl"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <p className="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-accent">Chat</p>
              <p className="font-serif text-[1.1rem] text-fg leading-tight">
                With Fred <span className="text-fg-dim text-[0.85rem]">— Adam's assistant</span>
              </p>
            </div>
            <div className="flex items-center gap-3">
              {(messages.length > 0 || introComplete) && (
                <button
                  type="button"
                  onClick={resetConversation}
                  className="px-2 py-2 -my-1 text-[0.7rem] tracking-[0.1em] uppercase text-fg-dim hover:text-fg transition-colors"
                  aria-label="Start a new conversation"
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="flex items-center justify-center w-10 h-10 -my-1 -mr-2 text-fg-dim hover:text-fg transition-colors text-2xl leading-none"
              >
                ×
              </button>
            </div>
          </div>

          {/* Body: intro form OR messages */}
          {!introComplete ? (
            <div className="flex-1 overflow-y-auto p-5">
              <p className="font-serif text-fg text-[1rem] mb-2">Hi — I'm Fred, Adam's assistant.</p>
              <p className="text-[0.9rem] text-fg-dim leading-[1.6] mb-5">
                Quick one before we chat: drop your name and email so Adam can follow up properly.
                I'll then help you work out whether (and how) Adam can help.
              </p>
              <label className="block text-[0.75rem] uppercase tracking-[0.1em] text-fg-dim mb-1" htmlFor="crox-chat-name">
                Name
              </label>
              <input
                id="crox-chat-name"
                type="text"
                autoComplete="name"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                placeholder="Sarah Patel"
                className="w-full bg-bg border border-border px-3 py-2 mb-3 text-[0.9rem] text-fg placeholder:text-fg-dim focus:outline-none focus:border-accent"
              />
              <label className="block text-[0.75rem] uppercase tracking-[0.1em] text-fg-dim mb-1" htmlFor="crox-chat-email">
                Email
              </label>
              <input
                id="crox-chat-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                value={emailDraft}
                onChange={(e) => setEmailDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    void submitIntro();
                  }
                }}
                placeholder="you@yourcompany.com"
                className="w-full bg-bg border border-border px-3 py-2 mb-3 text-[0.9rem] text-fg placeholder:text-fg-dim focus:outline-none focus:border-accent"
              />
              {introError && (
                <p className="text-[0.8rem] text-accent mb-3">{introError}</p>
              )}
              <button
                type="button"
                onClick={() => void submitIntro()}
                disabled={introSubmitting}
                className="font-mono text-[0.75rem] tracking-[0.1em] uppercase bg-accent text-fg px-4 py-2 hover:bg-[#c4472e] disabled:opacity-60 transition-colors"
              >
                {introSubmitting ? 'Starting…' : 'Start chat'}
              </button>
              <p className="mt-4 text-[0.75rem] text-fg-dim">
                Adam reads every conversation. Prefer email? <a href="mailto:adam@crox.io" className="text-accent underline">adam@crox.io</a>.
              </p>
            </div>
          ) : (
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((m, i) => (
                <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                  <div
                    className={
                      m.role === 'user'
                        ? 'max-w-[85%] bg-bg border border-border px-4 py-3 text-[0.9rem] leading-[1.6] text-fg whitespace-pre-wrap'
                        : 'max-w-[85%] px-1 py-1 text-[0.9rem] leading-[1.7] text-fg'
                    }
                  >
                    {m.content
                      ? (m.role === 'assistant'
                          ? <MarkdownMessage content={m.content} />
                          : m.content)
                      : (isStreaming && i === messages.length - 1 ? <span className="text-fg-dim italic">…</span> : null)}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Composer — only shown after intro */}
          {introComplete && (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(input);
              }}
              className="border-t border-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] flex items-end gap-2"
            >
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage(input);
                  }
                }}
                placeholder={isStreaming ? '…' : 'Type a message'}
                rows={1}
                disabled={isStreaming}
                className="flex-1 min-w-0 w-full resize-none bg-bg border border-border px-3 py-3 text-[0.95rem] text-fg placeholder:text-fg-dim focus:outline-none focus:border-accent disabled:opacity-60 min-h-[2.75rem] max-h-32"
                aria-label="Message"
              />
              <button
                type="submit"
                disabled={isStreaming || !input.trim()}
                className="shrink-0 font-mono text-[0.75rem] tracking-[0.1em] uppercase bg-accent text-fg px-5 py-3 min-h-[2.75rem] hover:bg-[#c4472e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                Send
              </button>
            </form>
          )}
        </div>
      )}
    </>
  );
}
