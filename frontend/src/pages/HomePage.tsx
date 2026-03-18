import { useState } from "react";

import FeatureCard from "../components/ui/Card";
import { ToggleCard } from "../components/ui/Card";

import HeroSection from "../components/layout/HeroSection";

//icons
import { PiLightningBold } from "react-icons/pi";
import { MdMobileFriendly } from "react-icons/md";
import { HiFlag } from "react-icons/hi";


export default function LegalGPTHome() {
  const [showLimitations, setShowLimitations] = useState(false);
  const [showHowToUse, setShowHowToUse] = useState(false);
  const [showAccuracy, setShowAccuracy] = useState(false);
  const [showLanguage, setShowLanguage] = useState(false);
  const [showFree, setShowFree] = useState(false);
  const [showLawyer, setShowLawyer] = useState(false);


  return (<>
    <HeroSection />
    {/* Background grid */}
    <div
      className="absolute inset-0 opacity-[0.04]"
      style={{
        backgroundImage:
          "linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px)",
        backgroundSize: "40px 40px",
      }}
    />
    <div className="w-full bg-primary-dark">
      {/* OBJECTIVES / INTRODUCTION */}
      <section className="mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-65 py-20">
        <p className="text-blue-400 text-sm font-medium uppercase tracking-widest mb-3">
          What is LegalGPT?
        </p>
        <h2 className="text-4xl font-bold text-white mb-6">
          Introducing LegalGPT
        </h2>

        <div className="max-w-3xl space-y-4">
          <p className="text-gray-400 leading-relaxed text-lg">
            LegalGPT aims to make Nepal's legal system easier to understand for everyone.
            Many citizens struggle with complex legal language, outdated documents, or
            a lack of accessible explanations. LegalGPT bridges this gap by offering
            simplified AI-generated summaries and explanations based on public legal
            information.
          </p>

          <p className="text-gray-400 leading-relaxed text-lg">
            It is built to assist students, researchers, individuals, and professionals
            by turning legal jargon into everyday language while promoting legal literacy
            across Nepal.
          </p>
        </div>
      </section>

      {/* FEATURES SECTION */}
      <section className="max-w-6xl mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-65 py-16">
        <h2 className="text-4xl font-bold text-white mb-8">
          Features
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FeatureCard
            index={1}
            title="Instant Legal Answers"
            icon={PiLightningBold}
            accent='#f59e0b'
            text="Ask anything about Nepali laws and get clear explanations within seconds."
          />
          <FeatureCard
            index={2}
            title="Nepal-Focused"
            icon={HiFlag}
            accent="#ec4899"
            text="Trained on public legal documents including the Muluki Ain and related legal codes."
          />
          <FeatureCard
            index={3}
            title="Beginner-Friendly"
            icon={MdMobileFriendly}
            accent="#10b981"
            text="Designed for citizens, students, and professionals with simplified clarity."
          />
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-65 py-20">
        <p className="text-blue-400 text-sm font-medium uppercase tracking-widest mb-3">
          FAQ
        </p>
        <h2 className="text-4xl font-bold text-white mb-3">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-400 text-lg mb-10 max-w-xl">
          Everything you need to know before getting started with LegalGPT.
        </p>

        <div className="space-y-3 px-20 flex flex-col justify-center ">
          <ToggleCard
            title="What are the limitations of LegalGPT?"
            isOpen={showLimitations}
            onToggle={() => setShowLimitations(!showLimitations)}
          >
            <ul className="space-y-2.5 text-gray-400 text-sm">
              {[
                "Not a substitute for consultation with a licensed lawyer.",
                "Responses may not always be 100% accurate or up-to-date.",
                "Does not draft legal documents or provide legal representation.",
                "Responses are derived from available public legal sources only.",
                "Cannot represent you in court or any legal proceedings.",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gray-600 flex-shrink-0 mt-1.5" />
                  {item}
                </li>
              ))}
            </ul>
          </ToggleCard>

          <ToggleCard
            title="Does LegalGPT support Nepali language?"
            isOpen={showLanguage}
            onToggle={() => setShowLanguage(!showLanguage)}
          >
            <p className="text-gray-400 text-sm leading-relaxed">
              Yes! LegalGPT supports both Nepali (Devanagari) and English. You can ask your
              questions in either language and receive a response in the same language. Bilingual
              support is a core part of our mission to make legal knowledge accessible across Nepal.
            </p>
          </ToggleCard>

          <ToggleCard
            title="Is LegalGPT free to use?"
            isOpen={showFree}
            onToggle={() => setShowFree(!showFree)}
          >
            <p className="text-gray-400 text-sm leading-relaxed">
              Yes, LegalGPT is completely free to use. It was built as a major academic project by
              students of IOE, Purwanchal Campus, with the goal of making legal literacy accessible
              to every Nepali citizen — without any cost barrier.
            </p>
          </ToggleCard>

          <ToggleCard
            title="Can LegalGPT replace a lawyer?"
            isOpen={showLawyer}
            onToggle={() => setShowLawyer(!showLawyer)}
          >
            <p className="text-gray-400 text-sm leading-relaxed">
              No. LegalGPT is an educational tool designed to help you <span className="text-white font-medium">understand</span> the law —
              not to provide legal advice or representation. For any serious legal matter such as
              court cases, contracts, or disputes, always consult a qualified and licensed lawyer
              in Nepal.
            </p>
          </ToggleCard>
        </div>
      </section>

    </div>
  </>
  );
}
