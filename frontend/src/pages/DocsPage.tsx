import { useState } from "react";
import {
  PiFilePdfBold,
  PiDatabaseBold,
  PiFileTextBold,
  PiDownloadSimpleBold,
  PiMagnifyingGlassBold,
  PiBookOpenBold,
  PiArrowRightBold,
  PiCheckCircleBold,
} from "react-icons/pi";

//pdfs
import nepalConstitution from '../assets/nepal-constitution.pdf'
import dataSet from '../assets/dataSet.json'
import majorReport from '../assets/Major_Report.pdf'

// ─── Data ────────────────────────────────────────────────────────────────────

const categories = ["All", "Reports", "Datasets", "Documentation"];

const documents = [
  {
    id: 1,
    category: "Reports",
    icon: PiFilePdfBold,
    accent: "#ef4444",
    tag: "PDF",
    title: "LegalGPT Project Report",
    description:
      "The complete major project report submitted to IOE, Purwanchal Campus (ERC). Covers system design, methodology, evaluation, and results.",
    size: "4.2 MB",
    version: "Final — 2024",
    highlights: ["System Architecture", "Model Evaluation", "Literature Review", "Conclusion & Future Work"],
    filename: "LegalGPT_Project_Report.pdf",
    download: majorReport
  },
  {
    id: 2,
    category: "Datasets",
    icon: PiDatabaseBold,
    accent: "#10b981",
    tag: "CSV / JSON",
    title: "Nepali Legal Datasets",
    description:
      "Curated legal datasets derived from publicly available Nepali legal documents including the Muluki Ain, Constitutional articles, and major legislative acts.",
    size: "18.7 MB",
    version: "v1.0 — 2024",
    highlights: ["Constitutional Provisions", "Muluki Ain Clauses", "Civil & Criminal Codes", "Annotated Q&A Pairs"],
    filename: "LegalGPT_Datasets.zip",
    download: dataSet

  },
  {
    id: 3,
    category: "Documentation",
    icon: PiFileTextBold,
    accent: "#3b82f6",
    tag: "Markdown / PDF",
    title: "Model Documentation",
    description: "Unofficial Legal constitution of Nepal translated in English language.",
    size: "4.9 MB",
    version: "v1.0 — 2014",
    highlights: ["Legal Document", "UnOfficial Translation"],
    filename: "Nepal Constitution (English).pdf",
    download: nepalConstitution
  }
];

function handleDownload(doc: any) {
  if (doc.filename.endsWith('.json')) {
    const blob = new Blob([JSON.stringify(doc.download, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = doc.filename;
    link.click();
    URL.revokeObjectURL(url);
    return;
  }
  // for pdf and other files
  const link = document.createElement('a');
  link.href = doc.download;
  link.download = doc.filename;
  link.click();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const DocCard = ({ doc }: { doc: (typeof documents)[0] }) => {
  const Icon = doc.icon;
  return (
    <div className="group bg-secondary/30 border border-gray-800 hover:border-gray-600 rounded-2xl p-6 transition-all duration-300 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${doc.accent}15`, border: `1px solid ${doc.accent}30` }}
        >
          <Icon className="w-6 h-6" style={{ color: doc.accent }} />
        </div>
        <span
          className="text-xs px-2.5 py-1 rounded-full font-medium"
          style={{ background: `${doc.accent}15`, color: doc.accent, border: `1px solid ${doc.accent}25` }}
        >
          {doc.tag}
        </span>
      </div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-white font-semibold text-lg mb-2">{doc.title}</h3>
        <p className="text-gray-400 text-sm leading-relaxed mb-4">{doc.description}</p>
        <ul className="space-y-1.5">
          {doc.highlights.map((h) => (
            <li key={h} className="flex items-center gap-2 text-gray-500 text-xs">
              <PiCheckCircleBold className="w-3.5 h-3.5 text-green-500/70 flex-shrink-0" />
              {h}
            </li>
          ))}
        </ul>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-800 pt-4 flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-xs">{doc.version}</p>
          <p className="text-gray-600 text-xs">{doc.size}</p>
        </div>
        <button
          onClick={() => handleDownload(doc)}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium text-white transition-all duration-200 hover:gap-3"
          style={{ background: `${doc.accent}CC` }}
        >
          <PiDownloadSimpleBold className="w-4 h-4" />
          Download
        </button>
      </div>
    </div>
  );
};

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function DocsPage() {
  const [active, setActive] = useState("All");
  const [search, setSearch] = useState("");

  const filtered = documents.filter((d) => {
    const matchCat = active === "All" || d.category === active;
    const matchSearch =
      d.title.toLowerCase().includes(search.toLowerCase()) ||
      d.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-emerald-600/10 blur-3xl rounded-full" />

        <div className="relative mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-65 py-20">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium mb-6">
            <PiBookOpenBold className="w-3.5 h-3.5" />
            Open Resources
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white leading-tight mb-5 max-w-3xl">
            Documentation &{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Downloads
            </span>
          </h1>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl">
            Access the project report, legal datasets, and technical documentation
            produced by Team Soonya as part of their IOE major project. All resources
            are free to download for research and educational purposes.
          </p>
        </div>
      </section>

      {/* ── Filter & Search ── */}
      <section className="border-b border-gray-800 bg-secondary/10 sticky top-0 z-10 backdrop-blur-sm">
        <div className="mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-65 py-4 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          {/* Category pills */}
          <div className="flex gap-2 flex-wrap">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200 border ${active === cat
                  ? "bg-emerald-500 border-emerald-500 text-white"
                  : "border-gray-700 text-gray-400 hover:border-gray-500 hover:text-gray-200"
                  }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search */}
          <div className="relative w-full sm:w-64">
            <PiMagnifyingGlassBold className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search documents…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-secondary/40 text-text placeholder-gray-500 py-2 pl-9 pr-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-600 border border-gray-800"
            />
          </div>
        </div>
      </section>

      {/* ── Documents Grid ── */}
      <section className="mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-65 py-16">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((doc) => (
              <DocCard key={doc.id} doc={doc} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 text-gray-600">
            <PiFileTextBold className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg">No documents found.</p>
          </div>
        )}
      </section>

      {/* ── Note ── */}
      <section className="border-t border-gray-800 bg-secondary/10">
        <div className="mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-65 py-10 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <p className="text-gray-500 text-sm max-w-xl">
            All materials are published for academic and research purposes only. If
            you use these resources in your work, please credit <span className="text-gray-300">Team Soonya — IOE, Purwanchal Campus (ERC)</span>.
          </p>
          <a
            href="mailto:soonya.legalgpt@gmail.com"
            className="flex-shrink-0 flex items-center gap-2 text-sm text-emerald-400 hover:text-emerald-300 transition"
          >
            Request access <PiArrowRightBold className="w-4 h-4" />
          </a>
        </div>
      </section>
    </div>
  );
}