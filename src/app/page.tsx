"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Code,
  Trophy,
  Users,
  Brain,
  Github,
  Twitter,
  Linkedin,
  Mail,
} from "lucide-react";

const neonStyles = `
@keyframes neon-glow {
  0%, 100% { filter: drop-shadow(0 0 10px #00f) drop-shadow(0 0 20px #00f); }
  50% { filter: drop-shadow(0 0 20px #0ff) drop-shadow(0 0 40px #0ff); }
}
.neon-text { animation: neon-glow 2s infinite; }
`;

export default function Home() {
  return (
    <main className="min-h-screen relative bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
      <style jsx global>{neonStyles}</style>

      {/* Hero Section */}
      <section className="relative min-h-screen flex flex-col justify-center items-center text-center px-6 py-24">
        <motion.h1
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
          className="neon-text text-5xl md:text-7xl font-extrabold text-white max-w-4xl mx-auto tracking-tight"
        >
          Unleash Your Coding Superpowers
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="text-gray-300 mt-8 text-lg md:text-xl max-w-2xl mx-auto"
        >
          Join a next-gen platform for learning, competing, and connecting with
          the world’s best developers.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.6 }}
          className="mt-12"
        >
          <Link
            href="/sign-up"
            className="inline-flex items-center px-10 py-4 text-lg font-semibold text-black bg-gradient-to-r from-cyan-400 to-blue-600 rounded-full shadow-lg hover:scale-105 transform transition-all duration-300"
          >
            Get Started
            <ArrowRight className="ml-3 w-5 h-5" />
          </Link>
        </motion.div>

        {/* Neon Floating Shapes */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
          <div className="absolute -top-32 left-1/3 w-96 h-96 bg-gradient-radial from-cyan-500/30 to-transparent rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-gradient-radial from-blue-500/20 to-transparent rounded-full blur-2xl animate-pulse" />
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 py-32">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-bold text-center text-white mb-16 neon-text"
        >
          What Awaits You
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto px-4">
          {[
            {
              icon: <Code className="h-8 w-8 text-cyan-400" />,
              title: "Master Coding",
              desc: "Hands-on lessons & projects to build real skills.",
            },
            {
              icon: <Trophy className="h-8 w-8 text-purple-400" />,
              title: "Win Challenges",
              desc: "Daily and weekly competitions with global rankings.",
            },
            {
              icon: <Users className="h-8 w-8 text-pink-400" />,
              title: "Meet Coders",
              desc: "Network & collaborate with a vibrant community.",
            },
            {
              icon: <Brain className="h-8 w-8 text-yellow-300" />,
              title: "AI Mentor",
              desc: "Personalized guidance & smart code reviews.",
            },
          ].map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.2 }}
              className="group bg-white/5 backdrop-blur-xl rounded-3xl p-8 border border-white/10 hover:bg-white/10 hover:scale-105 transition-all duration-500"
            >
              <div className="mb-6">{f.icon}</div>
              <h3 className="text-2xl font-bold text-white mb-3 group-hover:neon-text">
                {f.title}
              </h3>
              <p className="text-gray-300">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Call to Action */}
      <section className="relative py-24 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="bg-gradient-to-r from-cyan-500 to-blue-600 p-12 rounded-3xl mx-auto max-w-4xl shadow-2xl"
        >
          <h2 className="text-3xl md:text-4xl font-extrabold text-black mb-6">
            Ready to Begin Your Journey?
          </h2>
          <p className="text-black/80 mb-8">
            Take the first step towards mastering code with a supportive
            community.
          </p>
          <Link
            href="/sign-up"
            className="inline-flex items-center px-8 py-4 text-lg font-bold text-white bg-black rounded-full shadow-lg hover:scale-105 transition-all duration-300"
          >
            Join Now
            <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 py-12 mt-12">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center px-4 gap-8 text-gray-400">
          <p>© {new Date().getFullYear()} CodeHub. All rights reserved.</p>
          <div className="flex space-x-6">
            {[Github, Twitter, Linkedin, Mail].map((Icon, idx) => (
              <Link
                key={idx}
                href="#"
                className="hover:text-white transition-colors"
              >
                <Icon className="w-5 h-5" />
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </main>
  );
}
