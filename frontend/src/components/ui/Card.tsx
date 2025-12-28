import React from "react";

interface FeatureCardProps {
  title: string;
  text: string;
  icon: React.ElementType
}


export default function FeatureCard({ title, icon:Icon, text }:FeatureCardProps) {
  return (
    <div className="bg-white/25 p-8 rounded-2xl shadow hover:shadow-xl transition">
       <Icon  className="w-10 h-10 text-text mb-4"/>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-text mt-3">{text}</p>
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

const ToggleCard: React.FC<ToggleCardProps> = ({
  title,
  isOpen,
  onToggle,
  children,
}) => {
  return (
    <div className="border border-gray-700 rounded-lg overflow-hidden bg-primary-dark shadow-lg hover:shadow-xl transition-shadow duration-300">
      {/* Header */}
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between px-6 py-4 bg-linear-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary transition-all duration-300"
      >
        <h3 className="text-lg font-semibold text-white text-left">{title}</h3>
        <ChevronDown
          className={`w-6 h-6 text-secondary transition-transform duration-300 ${
            isOpen ? "rotate-180" : "rotate-0"
          }`}
        />
      </button>

      {/* Content */}
      <div
        className={`transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        } overflow-hidden`}
      >
        <div className="px-6 py-4 bg-gray-900/50">{children}</div>
      </div>
    </div>
  );
};

export { ToggleCard };