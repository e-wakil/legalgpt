import {
  PiGithubLogoBold,
  PiLinkedinLogoBold,
  PiGraduationCapBold,
  PiCodeBold,
  PiLightbulbBold,
  PiHeartBold,
  PiScalesBold,
  PiArrowRightBold,
} from "react-icons/pi";
import { Link } from "react-router-dom";

// ─── Data ────────────────────────────────────────────────────────────────────

const members = [
  {
    name: "Nishan Bhattarai",
    role: "AI / ML Engineer",
    bio: "Focused on model fine-tuning and the legal NLP pipeline. Loves digging into data and making machines understand complex language.",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/in/",
    initials: "NB",
    color: "#3b82f6",
  },
  {
    name: "Prasanga Niraula",
    role: "Backend Developer",
    bio: "Built the API layer and database architecture that powers LegalGPT. Clean code and scalable systems are his thing.",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/in/",
    initials: "PN",
    color: "#10b981",
  },
  {
    name: "Rajat Pradhan",
    role: "Full Stack Developer",
    bio: "Bridged the frontend and backend, making sure everything talks to each other seamlessly. Enjoys building end-to-end features.",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/in/",
    initials: "RP",
    color: "#f59e0b",
  },
  {
    name: "Yamraj Khadka",
    role: "Frontend Developer",
    bio: "Crafted the UI and user experience of LegalGPT. Believes great design makes complex tools feel simple and approachable.",
    github: "https://github.com/",
    linkedin: "https://linkedin.com/in/",
    initials: "YK",
    color: "#ec4899",
  },
];

const values = [
  {
    icon: PiLightbulbBold,
    title: "Curiosity",
    body: "We started this project because we were genuinely curious — can AI make legal knowledge accessible to every Nepali citizen?",
  },
  {
    icon: PiHeartBold,
    title: "Impact",
    body: "We care about building something useful. Not just for grades, but for the people who actually need legal clarity in their lives.",
  },
  {
    icon: PiCodeBold,
    title: "Craft",
    body: "We take pride in the quality of our code, design, and documentation. Every detail matters when you're building for real people.",
  },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

const MemberCard = ({ member }: { member: (typeof members)[0] }) => (
  <div className="group bg-secondary/30 border border-gray-800 hover:border-gray-600 rounded-2xl p-6 transition-all duration-300 hover:-translate-y-1 flex flex-col gap-5">
    {/* Avatar */}
    <div className="flex items-center gap-4">
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center text-white text-xl font-bold flex-shrink-0"
        style={{ background: `${member.color}25`, border: `2px solid ${member.color}40` }}
      >
        {/* Swap this img tag with actual photo when available */}
        {/* <img src={member.photo} className="w-full h-full object-cover rounded-2xl" /> */}
        <span style={{ color: member.color }}>{member.initials}</span>
      </div>
      <div>
        <h3 className="text-white font-semibold text-base">{member.name}</h3>
        <p
          className="text-xs font-medium mt-0.5"
          style={{ color: member.color }}
        >
          {member.role}
        </p>
      </div>
    </div>

    {/* Bio */}
    <p className="text-gray-400 text-sm leading-relaxed flex-1">{member.bio}</p>

    {/* Links */}
    <div className="flex gap-3 border-t border-gray-800 pt-4">
      <a
        href={member.github}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition"
      >
        <PiGithubLogoBold className="w-4 h-4" /> GitHub
      </a>
      <a
        href={member.linkedin}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-blue-400 transition"
      >
        <PiLinkedinLogoBold className="w-4 h-4" /> LinkedIn
      </a>
    </div>
  </div>
);

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AboutPage() {
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-violet-600/10 blur-3xl rounded-full" />

        <div className="relative mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-65 py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-xs font-medium mb-6">
            <PiGraduationCapBold className="w-3.5 h-3.5" />
            IOE Major Project — 4th Year, ERC
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-5 max-w-3xl">
            We are{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-pink-400">
              Soonya
            </span>{" "}
            👋
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
            Four friends, one shared goal — make Nepal's legal system understandable for
            everyone. LegalGPT is our major project, built with curiosity, late nights,
            and a lot of chai.
          </p>
        </div>
      </section>

      {/* ── Origin Story ── */}
      <section className="mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-65 py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <p className="text-violet-400 text-sm font-medium uppercase tracking-widest mb-3">
              Our Story
            </p>
            <h2 className="text-4xl font-bold text-white mb-6">
              Born out of a simple question
            </h2>
            <p className="text-gray-400 leading-relaxed mb-4">
              It started in a college discussion — why is it so hard for ordinary
              Nepali citizens to understand their own laws? Legal documents are
              complex, inaccessible, and often locked behind expensive consultations.
            </p>
            <p className="text-gray-400 leading-relaxed mb-4">
              As 4th year Computer Engineering students at{" "}
              <span className="text-gray-200 font-medium">
                IOE, Purwanchal Campus (Eastern Region Campus)
              </span>
              , we decided to do something about it. LegalGPT became our major
              project — a conversational AI assistant trained on Nepal's public
              legal documents.
            </p>
            <p className="text-gray-400 leading-relaxed">
              We're Team <span className="text-violet-400 font-semibold">Soonya</span> —
              named after the Nepali word for zero, because every big thing starts
              from zero. 🚀
            </p>
          </div>

          {/* Institution card */}
          <div className="bg-secondary/30 border border-gray-800 rounded-2xl p-8 flex flex-col gap-6">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <PiGraduationCapBold className="w-7 h-7 text-violet-400" />
              </div>
              <div>
                <p className="text-white font-semibold text-base">IOE, Purwanchal Campus</p>
                <p className="text-gray-500 text-sm">Eastern Region Campus (ERC)</p>
              </div>
            </div>
            <div className="h-px bg-gray-800" />
            <div className="space-y-3">
              {[
                ["Program", "Computer Engineering (B.E.)"],
                ["Year", "4th Year — Final Semester"],
                ["Project Type", "Major Project"],
                ["Academic Year", "2024 / 2025"],
              ].map(([label, value]) => (
                <div key={label} className="flex justify-between text-sm">
                  <span className="text-gray-500">{label}</span>
                  <span className="text-gray-300 font-medium">{value}</span>
                </div>
              ))}
            </div>
            <div className="h-px bg-gray-800" />
            <div className="flex items-center gap-2">
              <PiScalesBold className="w-4 h-4 text-violet-400" />
              <p className="text-gray-400 text-sm">
                Submitted to the Department of Computer & Electronics Engineering
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Team ── */}
      <section className="border-t border-gray-800 bg-secondary/10">
        <div className="mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-65 py-20">
          <div className="mb-12">
            <p className="text-violet-400 text-sm font-medium uppercase tracking-widest mb-3">
              The Team
            </p>
            <h2 className="text-4xl font-bold text-white mb-4">Meet the builders</h2>
            <p className="text-gray-400 text-lg max-w-xl">
              Four engineers, each bringing something different to the table — but
              all equally passionate about making this work.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {members.map((m) => (
              <MemberCard key={m.name} member={m} />
            ))}
          </div>

          <p className="text-gray-600 text-xs text-center mt-6">
            * Placeholder avatars — photos coming soon
          </p>
        </div>
      </section>

      {/* ── Values ── */}
      <section className="border-t border-gray-800">
        <div className="mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-65 py-20">
          <div className="mb-12 text-center">
            <p className="text-violet-400 text-sm font-medium uppercase tracking-widest mb-3">
              What Drives Us
            </p>
            <h2 className="text-4xl font-bold text-white">Our values</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map(({ icon: Icon, title, body }) => (
              <div
                key={title}
                className="bg-secondary/30 border border-gray-800 rounded-2xl p-6 text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-6 h-6 text-violet-400" />
                </div>
                <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="border-t border-gray-800 bg-secondary/10">
        <div className="mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-65 py-16 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-white font-bold text-2xl mb-1">Want to say hi?</h3>
            <p className="text-gray-400 text-sm">We'd love to hear from you — feedback, ideas, or just a hello.</p>
          </div>
          <Link
            to="/contact"
            className="flex-shrink-0 flex items-center gap-2 px-6 py-3 bg-violet-500 hover:bg-violet-600 text-white font-medium rounded-xl transition text-sm"
          >
            Contact Us <PiArrowRightBold className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  );
}