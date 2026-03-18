import { useState } from "react";
import {
  PiEnvelopeBold,
  PiGithubLogoBold,
  PiLinkedinLogoBold,
  PiMapPinBold,
  PiPaperPlaneTiltBold,
  PiCheckCircleBold,
  PiChatCircleTextBold,
} from "react-icons/pi";

// ─── Data ────────────────────────────────────────────────────────────────────

const members = [
  { name: "Nishan Bhattarai", github: "https://github.com/", linkedin: "https://linkedin.com/in/", initials: "NB", color: "#3b82f6" },
  { name: "Prasanga Niraula", github: "https://github.com/", linkedin: "https://linkedin.com/in/", initials: "PN", color: "#10b981" },
  { name: "Rajat Pradhan", github: "https://github.com/", linkedin: "https://linkedin.com/in/", initials: "RP", color: "#f59e0b" },
  { name: "Yamraj Khadka", github: "https://github.com/", linkedin: "https://linkedin.com/in/", initials: "YK", color: "#ec4899" },
];

const contactInfo = [
  {
    icon: PiEnvelopeBold,
    label: "Email Us",
    value: "soonya.legalgpt@gmail.com",
    href: "mailto:soonya.legalgpt@gmail.com",
    accent: "#3b82f6",
    sub: "We typically reply within 24 hours",
  },
  {
    icon: PiGithubLogoBold,
    label: "GitHub",
    value: "github.com/soonya-legalgpt",
    href: "https://github.com/",
    accent: "#e5e7eb",
    sub: "Check out our source code",
  },
  {
    icon: PiMapPinBold,
    label: "Campus Address",
    value: "IOE, Purwanchal Campus (ERC)",
    href: "https://maps.google.com/?q=IOE+Purwanchal+Campus+Dharan",
    accent: "#f59e0b",
    sub: "Dharan, Sunsari, Nepal",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // TODO: wire up to actual email/backend endpoint
    await new Promise((r) => setTimeout(r, 1200));
    setLoading(false);
    setSent(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  return (
    <div className="w-full bg-primary-dark min-h-screen">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden border-b border-gray-800">
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-blue-600/10 blur-3xl rounded-full" />

        <div className="relative mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-65 py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
            <PiChatCircleTextBold className="w-3.5 h-3.5" />
            We're friendly, promise
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-5 max-w-3xl">
            Get in{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Touch
            </span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-xl">
            Have a question about the project, found a bug, or want to collaborate?
            We're a team of four students and we'd genuinely love to hear from you.
          </p>
        </div>
      </section>

      {/* ── Main Content ── */}
      <section className="mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-65 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">

          {/* Left: Contact info + team profiles */}
          <div className="lg:col-span-2 flex flex-col gap-8">

            {/* Contact cards */}
            <div>
              <p className="text-blue-400 text-sm font-medium uppercase tracking-widest mb-5">
                Contact Info
              </p>
              <div className="flex flex-col gap-4">
                {contactInfo.map((c) => {
                  const Icon = c.icon;
                  return (
                    <a
                      key={c.label}
                      href={c.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-start gap-4 bg-secondary/30 border border-gray-800 hover:border-gray-600 rounded-xl p-4 transition-all duration-200"
                    >
                      <div
                        className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5"
                        style={{ background: `${c.accent}15`, border: `1px solid ${c.accent}25` }}
                      >
                        <Icon className="w-5 h-5" style={{ color: c.accent }} />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs mb-0.5">{c.label}</p>
                        <p className="text-white text-sm font-medium group-hover:underline">{c.value}</p>
                        <p className="text-gray-600 text-xs mt-0.5">{c.sub}</p>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Team LinkedIn / GitHub quick links */}
            <div>
              <p className="text-blue-400 text-sm font-medium uppercase tracking-widest mb-5">
                Reach the Team
              </p>
              <div className="flex flex-col gap-3">
                {members.map((m) => (
                  <div
                    key={m.name}
                    className="flex items-center justify-between bg-secondary/30 border border-gray-800 rounded-xl px-4 py-3"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0"
                        style={{ background: `${m.color}20`, color: m.color }}
                      >
                        {m.initials}
                      </div>
                      <span className="text-gray-300 text-sm">{m.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <a href={m.github} target="_blank" rel="noopener noreferrer"
                        className="text-gray-500 hover:text-white transition">
                        <PiGithubLogoBold className="w-4 h-4" />
                      </a>
                      <a href={m.linkedin} target="_blank" rel="noopener noreferrer"
                        className="text-gray-500 hover:text-blue-400 transition">
                        <PiLinkedinLogoBold className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: Email form */}
          <div className="lg:col-span-3">
            <p className="text-blue-400 text-sm font-medium uppercase tracking-widest mb-5">
              Send a Message
            </p>

            {sent ? (
              <div className="bg-green-500/10 border border-green-500/20 rounded-2xl p-12 flex flex-col items-center justify-center text-center gap-4 h-full min-h-[400px]">
                <PiCheckCircleBold className="w-14 h-14 text-green-400" />
                <h3 className="text-white font-semibold text-xl">Message sent!</h3>
                <p className="text-gray-400 text-sm max-w-xs">
                  Thanks for reaching out. We'll get back to you within 24 hours. 🙏
                </p>
                <button
                  onClick={() => { setSent(false); setForm({ name: "", email: "", subject: "", message: "" }); }}
                  className="mt-2 text-sm text-green-400 hover:text-green-300 transition underline underline-offset-2"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 text-xs font-medium">Your Name</label>
                    <input
                      required
                      name="name"
                      value={form.name}
                      onChange={handleChange}
                      placeholder="Nishan Bhattarai"
                      className="bg-secondary/40 border border-gray-800 focus:border-gray-600 text-text placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition"
                    />
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <label className="text-gray-400 text-xs font-medium">Email Address</label>
                    <input
                      required
                      type="email"
                      name="email"
                      value={form.email}
                      onChange={handleChange}
                      placeholder="you@example.com"
                      className="bg-secondary/40 border border-gray-800 focus:border-gray-600 text-text placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs font-medium">Subject</label>
                  <select
                    name="subject"
                    value={form.subject}
                    onChange={handleChange}
                    required
                    className="bg-secondary/40 border border-gray-800 focus:border-gray-600 text-text rounded-xl px-4 py-3 text-sm outline-none transition appearance-none"
                  >
                    <option value="" disabled>Select a topic…</option>
                    <option>General Inquiry</option>
                    <option>Bug Report</option>
                    <option>Collaboration / Research</option>
                    <option>Dataset / Documentation Request</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-gray-400 text-xs font-medium">Message</label>
                  <textarea
                    required
                    name="message"
                    value={form.message}
                    onChange={handleChange}
                    rows={6}
                    placeholder="Tell us what's on your mind…"
                    className="bg-secondary/40 border border-gray-800 focus:border-gray-600 text-text placeholder-gray-600 rounded-xl px-4 py-3 text-sm outline-none transition resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="self-start flex items-center gap-2 px-7 py-3 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white font-medium rounded-xl transition-all duration-200 text-sm"
                >
                  {loading ? (
                    <>
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending…
                    </>
                  ) : (
                    <>
                      <PiPaperPlaneTiltBold className="w-4 h-4" />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── Map / Campus note ── */}
      <section className="border-t border-gray-800 bg-secondary/10">
        <div className="mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-65 py-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center flex-shrink-0">
              <PiMapPinBold className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <p className="text-white text-sm font-medium">IOE, Purwanchal Campus (ERC)</p>
              <p className="text-gray-500 text-xs">Dharan-8, Sunsari, Koshi Province, Nepal</p>
            </div>
          </div>
          <a
            href="https://maps.google.com/?q=IOE+Purwanchal+Campus+Dharan"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-amber-400 hover:text-amber-300 transition flex items-center gap-1.5"
          >
            View on Google Maps →
          </a>
        </div>
      </section>
    </div>
  );
}