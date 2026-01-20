import React from "react";
import { Link } from "react-router-dom";
import {ButtonFill} from "../ui/Button";

const HeroSection: React.FC = () => {
  return (
    <section
      className="relative w-full h-screen bg-cover bg-center bg-no-repeat flex items-center justify-center"
      // replace with your image
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-primary-dark"></div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-4 max-w-3xl">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
          Your Smart Legal Assistant – Powered by AI
        </h1>

        <p className="text-lg md:text-xl mb-10 opacity-90">
          LegalGPT helps you understand Nepalese laws, generate legal drafts, and get instant reliable answers to legal questions.
        </p>

        {/* Buttons */}
        <div className="flex gap-6 justify-center">
          <button className="px-6 py-3 bg-accent cursor-pointer rounded-md font-semibold text-primary-light hover:bg-accent-light transition">
            Learn More
          </button>
          <Link to='/chat'>
           <ButtonFill className="px-8 py-3   text-lg  " content='Start Asking Questions' />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
