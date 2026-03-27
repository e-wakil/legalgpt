import React from "react";

interface FeatureCardProps {
  title: string;
  text: string;
  index: number;
  accent:string;
  icon: React.ElementType
}


export default function FeatureCard({ title, icon:Icon, text, index, accent }:FeatureCardProps) {
  return (
  <div
    className="group relative bg-secondary/30 border border-gray-800 rounded-2xl p-6 hover:border-gray-600 transition-all duration-300 hover:-translate-y-1"
    style={{ animationDelay: `${index * 80}ms` }}
  >
    {/* Glow blob */}
    <div
      className="absolute top-0 right-0 w-24 h-24 rounded-full opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-2xl"
      style={{ background: accent }}
    />
    <div
      className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
      style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}
    >
      <Icon className="w-5 h-5" style={{ color: accent }} />
    </div>
    <h3 className="text-white font-semibold text-base mb-2">{title}</h3>
    <p className="text-gray-400 text-sm leading-relaxed">{text}</p>
  </div>
  );
}


// ToggleCard Component
interface ToggleCardProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}
const ChevronDown = ({ className = "" }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M19 9l-7 7-7-7"
    />
  </svg>
);

const ToggleCard: React.FC<ToggleCardProps> = ({ title, isOpen, onToggle, children }) => {
  return (
    <div
      className={`border rounded-2xl overflow-hidden transition-all duration-300 ${
        isOpen ? "border-gray-600 bg-secondary/30" : "border-gray-800 bg-secondary/10 hover:border-gray-700"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-5 text-left"
      >
        <h3 className="text-base font-semibold text-white pr-4">{title}</h3>
        <ChevronDown
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      <div
        className={`transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-6 pb-5 border-t border-gray-800 pt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export { ToggleCard };