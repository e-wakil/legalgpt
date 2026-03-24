import { useState } from "react";
import { Link } from "react-router-dom";

// Icons
import { PiLightningBold, PiScalesBold, PiBookOpenBold, PiChatCircleTextBold, PiShieldCheckBold, PiTranslateBold, PiMagnifyingGlassBold, PiClockCountdownBold, PiArrowRightBold } from "react-icons/pi";
import { HiFlag } from "react-icons/hi";
import { MdMobileFriendly } from "react-icons/md";
import FeatureCard from "../components/ui/Card";

// ─── Data ────────────────────────────────────────────────────────────────────

const coreFeatures = [
  {
    icon: PiLightningBold,
    title: "Instant Legal Answers",
    text:
      "Ask anything about Nepali laws and receive clear, structured explanations within seconds — no legal training required.",
    accent: "#f59e0b",
  },
  {
    icon: HiFlag,
    title: "Nepal-Focused Knowledge",
    text:
      "Built on public legal documents including the Muluki Ain, Constitutional provisions, and major legislative codes of Nepal.",
    accent: "#3b82f6",
  },
  {
    icon: MdMobileFriendly,
    title: "Beginner-Friendly",
    text:
      "Designed to serve citizens, students, and professionals alike — no legal jargon, just plain language.",
    accent: "#10b981",
  },
  {
    icon: PiTranslateBold,
    title: "Bilingual Support",
    text:
      "Ask your questions in Nepali or English. LegalGPT understands and responds in the language you're most comfortable with.",
    accent: "#8b5cf6",
  },
  {
    icon: PiChatCircleTextBold,
    title: "Conversational Interface",
    text:
      "Follow-up questions, clarifications, and multi-turn conversations — it feels like talking to a knowledgeable legal guide.",
    accent: "#ec4899",
  },
  {
    icon: PiScalesBold,
    title: "Legal Code References",
    text:
      "Every answer cites the relevant act, section, or clause so you know exactly where the information is coming from.",
    accent: "#f97316",
  },
];

const deepDiveFeatures = [
  {
    icon: PiBookOpenBold,
    title: "Legal Document Summaries",
    body: "Paste or describe a complex legal document and get a concise, plain-language summary in seconds. Great for tenancy agreements, employment contracts, and public notices.",
    tag: "Productivity",
  },
  {
    icon: PiMagnifyingGlassBold,
    title: "Case Scenario Analysis",
    body: "Describe your situation in plain terms — LegalGPT walks you through the relevant laws, likely interpretations, and what steps you could consider next.",
    tag: "Guidance",
  },
  {
    icon: PiShieldCheckBold,
    title: "Rights Awareness",
    body: "Understand your fundamental rights as a Nepali citizen. From property rights to consumer protection, LegalGPT explains what the law guarantees you.",
    tag: "Empowerment",
  },
  {
    icon: PiClockCountdownBold,
    title: "Statute of Limitations Lookup",
    body: "Quickly find time limits for filing complaints, appeals, or claims across civil, criminal, and administrative domains in Nepal.",
    tag: "Reference",
  },
];

const stats = [
  { value: "50+", label: "Legal Acts Covered" },
  { value: "24/7", label: "Always Available" },
  { value: "2", label: "Languages Supported" },
  { value: "Free", label: "No Cost to Use" },
];

// ─── Sub-components ───────────────────────────────────────────────────────────


const DeepDiveCard = ({
  icon: Icon,
  title,
  body,
  tag,
  index,
}: {
  icon: any;
  title: string;
  body: string;
  tag: string;
  index: number;
}) => (
  <div className="flex gap-5 group" style={{ animationDelay: `${index * 100}ms` }}>
    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mt-1">
      <Icon className="w-5 h-5 text-blue-400" />
    </div>
    <div className="flex-1 border-b border-gray-800 pb-6">
      <div className="flex items-center gap-3 mb-1.5">
        <h3 className="text-white font-semibold text-base">{title}</h3>
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
          {tag}
        </span>
      </div>
      <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FeaturesPage() {
  return (
    <div className="w-full bg-primary-dark min-h-screen">

      {/* ── Hero Banner ── */}
      <section className="relative overflow-hidden border-b border-gray-800">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-3xl rounded-full" />

        <div className="relative mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-65 py-24">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-medium mb-6">
            <PiScalesBold className="w-3.5 h-3.5" />
            Built for Nepal's Legal Landscape
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-6 max-w-3xl">
            Everything You Need to{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
              Navigate the Law
            </span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mb-10">
            LegalGPT brings together AI intelligence and Nepal's legal framework so
            that anyone — from a farmer in Dhading to a student in Kathmandu — can
            understand their rights without barriers.
          </p>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-xl transition-all duration-200 text-sm"
          >
            Try it free <PiArrowRightBold className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ── Stats Bar ── */}
      <section className="border-b border-gray-800 bg-secondary/20">
        <div className="mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-65 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s) => (
            <div key={s.label} className="text-center">
              <p className="text-3xl font-bold text-white mb-1">{s.value}</p>
              <p className="text-gray-500 text-sm">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Core Features Grid ── */}
      <section className="mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-65 py-20">
        <div className="mb-12">
          <p className="text-blue-400 text-sm font-medium uppercase tracking-widest mb-3">
            Core Capabilities
          </p>
          <h2 className="text-4xl font-bold text-white mb-4">
            What LegalGPT Can Do
          </h2>
          <p className="text-gray-400 text-lg max-w-xl">
            A suite of features carefully designed around the real needs of Nepali
            citizens, students, and legal professionals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coreFeatures.map((f, i) => (
            <FeatureCard key={f.title} {...f} index={i} />
          ))}
        </div>
      </section>

      {/* ── Deep Dive List ── */}
      <section className="border-t border-gray-800 bg-secondary/10">
        <div className="mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-65 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            {/* Left: sticky heading */}
            <div className="lg:sticky lg:top-24">
              <p className="text-blue-400 text-sm font-medium uppercase tracking-widest mb-3">
                Advanced Tools
              </p>
              <h2 className="text-4xl font-bold text-white mb-5">
                Go Deeper With Your Legal Questions
              </h2>
              <p className="text-gray-400 leading-relaxed mb-8">
                Beyond simple Q&A, LegalGPT offers powerful tools for understanding
                complex situations, scanning documents, and knowing your rights
                inside out.
              </p>

              {/* Illustration placeholder — scales of justice motif */}
              <div className="rounded-2xl border border-gray-800 bg-secondary/30 p-8 flex flex-col items-center justify-center gap-4">
                <PiScalesBold className="w-16 h-16 text-blue-400/40" />
                <p className="text-gray-600 text-sm text-center">
                  Balanced. Transparent. Accessible.
                </p>
                <div className="w-full h-px bg-gradient-to-r from-transparent via-blue-500/30 to-transparent" />
                <p className="text-gray-500 text-xs text-center leading-relaxed max-w-xs">
                  LegalGPT does not replace a licensed lawyer. Always seek
                  professional legal advice for serious matters.
                </p>
              </div>
            </div>

            {/* Right: feature list */}
            <div className="flex flex-col gap-6">
              {deepDiveFeatures.map((f, i) => (
                <DeepDiveCard key={f.title} {...f} index={i} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="border-t border-gray-800">
        <div className="mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-65 py-20 text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Ready to understand your rights?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Start a conversation with LegalGPT today — no signup required, no legal
            background needed.
          </p>
          <Link
            to="/chat"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl transition-all duration-200"
          >
            Start Chatting <PiArrowRightBold className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}