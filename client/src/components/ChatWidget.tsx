// Floating chat widget on every page.
//
// Streams from chat.crox.io/chat over Server-Sent Events. Persists the
// conversation in localStorage so a page reload doesn't lose it. When
// the user submits an email, POSTs the transcript to /capture which
// upserts the Fibery contact (via flight-deck /api/forms) and appends
// the conversation to their Activity Stream.
//
// Identity: reads window.croxAttribution (set by flight-deck/track.js)
// to pass the visitor_id and contact_ref through. Works fine without
// either — the server synthesises a visitor_id and creates a new
// contact if none matches.

import { useEffect, useRef, useState } from 'react';

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

const STORAGE_KEY = 'crox_chat_v1';
const DEFAULT_CHAT_BASE_URL = 'https://chat.crox.io';
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface StoredState {
  messages: Message[];
  capturedEmail: string | null;
}

function loadStored(): StoredState {
  if (typeof window === 'undefined') return { messages: [], capturedEmail: null };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { messages: [], capturedEmail: null };
    const parsed = JSON.parse(raw) as StoredState;
    if (!parsed || !Array.isArray(parsed.messages)) return { messages: [], capturedEmail: null };
    return {
      messages: parsed.messages,
      capturedEmail: typeof parsed.capturedEmail === 'string' ? parsed.capturedEmail : null,
    };
  } catch {
    return { messages: [], capturedEmail: null };
  }
}

function persist(state: StoredState) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage may be disabled — silently degrade to per-session.
  }
}

export default function ChatWidget({ chatBaseUrl = DEFAULT_CHAT_BASE_URL }: Props) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [emailDraft, setEmailDraft] = useState('');
  const [nameDraft, setNameDraft] = useState('');
  const [capturedEmail, setCapturedEmail] = useState<string | null>(null);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [hasOpenedOnce, setHasOpenedOnce] = useState(false);

  const scrollRef = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Hydrate from localStorage on mount.
  useEffect(() => {
    const s = loadStored();
    setMessages(s.messages);
    setCapturedEmail(s.capturedEmail);
  }, []);

  // Persist whenever conversation changes.
  useEffect(() => {
    persist({ messages, capturedEmail });
  }, [messages, capturedEmail]);

  // Auto-scroll to bottom on new content.
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isStreaming]);

  // Open seeds an opening prompt if conversation is empty.
  useEffect(() => {
    if (isOpen && !hasOpenedOnce) {
      setHasOpenedOnce(true);
      if (messages.length === 0) {
        // Don't auto-send — just show the greeting as a sticky welcome.
        // The bot greets when the user sends their first message.
      }
    }
  }, [isOpen, hasOpenedOnce, messages.length]);

  async function sendMessage(text: string) {
    if (!text.trim() || isStreaming) return;

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

        // SSE frames are separated by blank lines.
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
    } catch (err) {
      if ((err as Error).name === 'AbortError') return;
      setMessages((current) => {
        const updated = [...current];
        if (updated[placeholderIndex]?.role === 'assistant' && !updated[placeholderIndex].content) {
          updated[placeholderIndex] = {
            role: 'assistant',
            content: "I couldn't reach the server. Try again in a moment, or drop me a note at adam@crox.io.",
          };
        }
        return updated;
      });
    } finally {
      setIsStreaming(false);
      abortRef.current = null;
    }
  }

  async function submitEmail() {
    const email = emailDraft.trim();
    if (!EMAIL_RE.test(email)) {
      setCaptureError("That doesn't look like an email. Try again?");
      return;
    }
    setCaptureError(null);

    try {
      const resp = await fetch(`${chatBaseUrl}/capture`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          name: nameDraft.trim() || undefined,
          page_url: window.location.href,
          visitor_id: window.croxAttribution?.visitorId,
          contact_ref: window.croxAttribution?.contactId,
          conversation: messages,
        }),
      });

      if (!resp.ok) {
        const detail = await resp.text().catch(() => '');
        throw new Error(`capture_${resp.status}_${detail.slice(0, 40)}`);
      }

      setCapturedEmail(email);
      setShowEmailForm(false);
      // Inject a confirmation message so the bot acknowledges in-thread.
      setMessages((m) => [
        ...m,
        {
          role: 'assistant',
          content: `Got it — I'll be in touch at ${email} within a working day or two. Happy to keep talking in the meantime if there's more you want to dig into.`,
        },
      ]);
    } catch (err) {
      console.warn('[crox-chat] capture failed:', err);
      setCaptureError("Couldn't save that just now. Try again, or email adam@crox.io directly.");
    }
  }

  function resetConversation() {
    abortRef.current?.abort();
    setMessages([]);
    setCapturedEmail(null);
    setShowEmailForm(false);
    setEmailDraft('');
    setNameDraft('');
    setInput('');
    setHasOpenedOnce(false);
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
          aria-label="Open chat with Adam"
          className="fixed bottom-6 right-6 z-40 flex items-center gap-2 bg-accent text-fg font-mono text-[0.75rem] tracking-[0.12em] uppercase px-5 py-3 shadow-lg hover:bg-[#c4472e] hover:-translate-y-px transition-all"
        >
          <span>Chat with Adam</span>
        </button>
      )}

      {/* Panel */}
      {isOpen && (
        <div
          role="dialog"
          aria-label="Chat with Adam"
          className="fixed bottom-4 right-4 z-50 w-[min(420px,calc(100vw-2rem))] h-[min(640px,calc(100vh-2rem))] bg-bg border border-border shadow-2xl flex flex-col"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-border">
            <div>
              <p className="font-mono text-[0.7rem] tracking-[0.15em] uppercase text-accent">Chat</p>
              <p className="font-serif text-[1.1rem] text-fg leading-tight">With Adam</p>
            </div>
            <div className="flex items-center gap-3">
              {messages.length > 0 && (
                <button
                  type="button"
                  onClick={resetConversation}
                  className="text-[0.7rem] tracking-[0.1em] uppercase text-fg-dim hover:text-fg transition-colors"
                  aria-label="Start a new conversation"
                >
                  Reset
                </button>
              )}
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="text-fg-dim hover:text-fg transition-colors text-xl leading-none p-1"
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-[0.9rem] text-fg-dim leading-[1.7]">
                <p className="mb-3 font-serif text-fg text-[1rem]">Hi — I'm Adam.</p>
                <p>
                  Ask me anything about Crox, the AI work I do, or whether I'm the right person to help
                  with what you're trying to figure out. The four offerings and their prices are on the
                  site — happy to walk you through which one fits.
                </p>
                <p className="mt-3 text-[0.8rem] text-fg-dim">
                  This is a chat. I read every conversation. If you'd rather email directly: adam@crox.io.
                </p>
              </div>
            )}

            {messages.map((m, i) => (
              <div key={i} className={m.role === 'user' ? 'flex justify-end' : 'flex justify-start'}>
                <div
                  className={
                    m.role === 'user'
                      ? 'max-w-[85%] bg-surface border border-border px-4 py-3 text-[0.9rem] leading-[1.6] text-fg whitespace-pre-wrap'
                      : 'max-w-[85%] px-1 py-1 text-[0.9rem] leading-[1.7] text-fg whitespace-pre-wrap'
                  }
                >
                  {m.content || (isStreaming && i === messages.length - 1 ? <span className="text-fg-dim italic">…</span> : null)}
                </div>
              </div>
            ))}
          </div>

          {/* Email capture inline form */}
          {showEmailForm && !capturedEmail && (
            <div className="border-t border-border p-4 bg-surface">
              <p className="text-[0.85rem] text-fg leading-[1.5] mb-3">
                Drop your email and I'll follow up properly. Name's optional but useful.
              </p>
              <input
                type="email"
                inputMode="email"
                autoComplete="email"
                value={emailDraft}
                onChange={(e) => setEmailDraft(e.target.value)}
                placeholder="you@yourcompany.com"
                className="w-full bg-bg border border-border px-3 py-2 mb-2 text-[0.9rem] text-fg placeholder:text-fg-dim focus:outline-none focus:border-accent"
                aria-label="Email"
              />
              <input
                type="text"
                autoComplete="name"
                value={nameDraft}
                onChange={(e) => setNameDraft(e.target.value)}
                placeholder="Name (optional)"
                className="w-full bg-bg border border-border px-3 py-2 mb-3 text-[0.9rem] text-fg placeholder:text-fg-dim focus:outline-none focus:border-accent"
                aria-label="Name"
              />
              {captureError && (
                <p className="text-[0.8rem] text-accent mb-2">{captureError}</p>
              )}
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={submitEmail}
                  className="font-mono text-[0.75rem] tracking-[0.1em] uppercase bg-accent text-fg px-4 py-2 hover:bg-[#c4472e] transition-colors"
                >
                  Send
                </button>
                <button
                  type="button"
                  onClick={() => { setShowEmailForm(false); setCaptureError(null); }}
                  className="font-mono text-[0.75rem] tracking-[0.1em] uppercase text-fg-dim hover:text-fg px-4 py-2 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}

          {/* Composer */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendMessage(input);
            }}
            className="border-t border-border p-3 flex items-end gap-2"
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
              className="flex-1 resize-none bg-bg border border-border px-3 py-2 text-[0.9rem] text-fg placeholder:text-fg-dim focus:outline-none focus:border-accent disabled:opacity-60 max-h-32"
              aria-label="Message"
            />
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                disabled={isStreaming || !input.trim()}
                className="font-mono text-[0.7rem] tracking-[0.1em] uppercase bg-accent text-fg px-3 py-2 hover:bg-[#c4472e] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                Send
              </button>
              {!capturedEmail && messages.length >= 2 && !showEmailForm && (
                <button
                  type="button"
                  onClick={() => setShowEmailForm(true)}
                  className="font-mono text-[0.65rem] tracking-[0.1em] uppercase text-fg-dim hover:text-fg transition-colors"
                  aria-label="Leave email"
                >
                  Email
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </>
  );
}
