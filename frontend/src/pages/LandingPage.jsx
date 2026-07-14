import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Database, Bot, Network, LayoutGrid, ChevronRight, 
  Code2, Zap, Shield, Search, BarChart3,
  ArrowRight, Menu, X, CheckCircle2, ChevronDown
} from 'lucide-react';

const fadeIn = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

export default function LandingPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const faqs = [
    { question: "Is Foundry Lite truly free?", answer: "Yes! Foundry Lite is 100% open-source and free to use forever. There are no hidden fees or paywalls." },
    { question: "Do I need an internet connection for the AI features?", answer: "No. Foundry Lite uses Ollama to run large language models locally on your machine, ensuring your data never leaves your environment." },
    { question: "What data formats are supported?", answer: "Currently, we support CSV, JSON, and standard SQL databases like SQLite and PostgreSQL." },
    { question: "Can I deploy this for my whole team?", answer: "Absolutely. Foundry Lite can be containerized using Docker and deployed on your internal servers for team access." }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 selection:bg-blue-500/30 font-sans">
      
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded bg-blue-600 flex items-center justify-center">
                <LayoutGrid size={18} className="text-white" />
              </div>
              <span className="font-bold text-xl tracking-tight">Foundry Lite</span>
            </div>
            
            <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
              <a href="#features" className="hover:text-gray-900 transition-colors">Features</a>
              <a href="#architecture" className="hover:text-gray-900 transition-colors">Architecture</a>
              <a href="#pricing" className="hover:text-gray-900 transition-colors">Pricing</a>
              <a href="#faq" className="hover:text-gray-900 transition-colors">FAQ</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <a href="https://github.com" target="_blank" rel="noreferrer" className="text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-2">
                <Code2 size={20} />
                <span className="text-sm font-medium">Star on GitHub</span>
              </a>
              <Link to="/dashboard" className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-gray-800 transition-colors">
                Launch App
              </Link>
            </div>

            <button className="md:hidden text-gray-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-white pt-20 px-4 md:hidden">
          <div className="flex flex-col gap-6 text-lg font-medium text-gray-600">
            <a href="#features" onClick={() => setIsMobileMenuOpen(false)}>Features</a>
            <a href="#architecture" onClick={() => setIsMobileMenuOpen(false)}>Architecture</a>
            <a href="#pricing" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
            <Link to="/dashboard" className="text-blue-600" onClick={() => setIsMobileMenuOpen(false)}>Launch App</Link>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden flex flex-col items-center text-center">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-500/10 via-white to-white -z-10" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-blue-500/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        <motion.div initial="hidden" animate="visible" variants={fadeIn} className="max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-700 text-sm font-medium mb-8">
            <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
            v1.0 is now live (Local AI Edition)
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-tight">
            The intelligent operating system <br className="hidden md:block" /> for your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">local data</span>.
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Connect your datasets, build knowledge graphs, and leverage local LLMs to generate insights—all without your data ever leaving your machine.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard" className="bg-gray-900 text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-800 transition-colors flex items-center justify-center gap-2 group">
              Get Started <ArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <a href="#demo" className="bg-gray-50 border border-gray-200 text-gray-900 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transition-colors flex items-center justify-center gap-2">
              <Code2 size={20} /> View Source
            </a>
          </div>
        </motion.div>

        {/* Hero Interactive Demo / Screenshot */}
        <motion.div 
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, type: "spring" }}
          className="mt-20 w-full max-w-6xl relative"
        >
          <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur opacity-20" />
          <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-white shadow-2xl shadow-blue-900/10">
            <div className="flex items-center px-4 py-3 border-b border-gray-200 bg-gray-50">
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="mx-auto text-xs font-medium text-gray-500 bg-white border border-gray-200 px-24 py-1.5 rounded-md">foundry-lite.local</div>
            </div>
            {/* Fake Dashboard Screenshot */}
            <div className="h-[600px] w-full bg-gray-50 flex bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGNpcmNsZSBjeD0iMiIgY3k9IjIiIHI9IjEiIGZpbGw9InJnYmEoMCwwLDAsMC4wNSkiLz48L3N2Zz4=')]">
              <div className="w-64 border-r border-gray-200 p-4 flex flex-col gap-4">
                <div className="w-3/4 h-8 bg-gray-200 rounded" />
                <div className="w-full h-8 bg-blue-100 rounded" />
                <div className="w-5/6 h-8 bg-gray-200 rounded" />
                <div className="w-4/5 h-8 bg-gray-200 rounded" />
              </div>
              <div className="flex-1 p-8 flex flex-col gap-8">
                <div className="flex justify-between items-center">
                  <div className="w-48 h-8 bg-gray-200 rounded" />
                  <div className="w-32 h-8 bg-gray-200 rounded" />
                </div>
                <div className="flex gap-6">
                  <div className="flex-1 h-32 bg-white rounded-xl border border-gray-200 shadow-sm" />
                  <div className="flex-1 h-32 bg-white rounded-xl border border-gray-200 shadow-sm" />
                  <div className="flex-1 h-32 bg-white rounded-xl border border-gray-200 shadow-sm" />
                </div>
                <div className="flex-1 bg-white rounded-xl border border-gray-200 shadow-sm relative overflow-hidden">
                  <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-blue-50 to-transparent" />
                  <svg className="absolute w-full h-full text-blue-500/50" preserveAspectRatio="none" viewBox="0 0 100 100">
                    <path d="M0 100 L 20 80 L 40 90 L 60 50 L 80 60 L 100 20 L 100 100 Z" fill="currentColor" opacity="0.1" />
                    <path d="M0 100 L 20 80 L 40 90 L 60 50 L 80 60 L 100 20" fill="transparent" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Bento Box */}
      <section id="features" className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Everything you need to <br className="hidden md:block"/> analyze data securely.</h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">Built from the ground up for privacy, speed, and intelligence. No cloud required.</p>
        </div>

        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Feature 1 */}
          <motion.div variants={fadeIn} className="md:col-span-2 bg-gray-50 border border-gray-200 rounded-3xl p-8 hover:bg-gray-100 transition-colors relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Network className="text-blue-600 mb-6" size={32} />
            <h3 className="text-2xl font-semibold mb-3">Knowledge Graph</h3>
            <p className="text-gray-600 max-w-md">Automatically map relationships between disparate datasets to form a unified, queryable ontology. Visualize connections effortlessly.</p>
          </motion.div>

          {/* Feature 2 */}
          <motion.div variants={fadeIn} className="bg-gray-50 border border-gray-200 rounded-3xl p-8 hover:bg-gray-100 transition-colors relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Bot className="text-cyan-600 mb-6" size={32} />
            <h3 className="text-2xl font-semibold mb-3">Local AI</h3>
            <p className="text-gray-600">Powered by Ollama. Chat with your data instantly without sending it over the internet.</p>
          </motion.div>

          {/* Feature 3 */}
          <motion.div variants={fadeIn} className="bg-gray-50 border border-gray-200 rounded-3xl p-8 hover:bg-gray-100 transition-colors relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <LayoutGrid className="text-purple-600 mb-6" size={32} />
            <h3 className="text-2xl font-semibold mb-3">Drag & Drop Dashboards</h3>
            <p className="text-gray-600">Construct complex dashboards in seconds with a responsive grid layout system.</p>
          </motion.div>

          {/* Feature 4 */}
          <motion.div variants={fadeIn} className="md:col-span-2 bg-gray-50 border border-gray-200 rounded-3xl p-8 hover:bg-gray-100 transition-colors relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <Zap className="text-emerald-600 mb-6" size={32} />
            <h3 className="text-2xl font-semibold mb-3">Real-time Transformations</h3>
            <p className="text-gray-600 max-w-md">Filter, sort, join, and aggregate data visually using node-based pipelines. See the results instantly before committing changes.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Architecture Overview */}
      <section id="architecture" className="py-32 border-y border-gray-200 bg-gray-50 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Private by design.</h2>
            <p className="text-gray-600 text-lg">A modern stack that runs entirely on your local machine.</p>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="flex flex-col md:flex-row items-center justify-center gap-8 md:gap-16 relative"
          >
            {/* React Flow Connection line (fake) */}
            <div className="hidden md:block absolute top-1/2 left-1/4 right-1/4 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-cyan-500 opacity-30 -translate-y-1/2 -z-10" />

            <div className="bg-white border border-gray-200 shadow-sm p-8 rounded-2xl w-64 text-center">
              <Database className="mx-auto text-blue-600 mb-4" size={40} />
              <h4 className="font-semibold text-lg mb-2">Local Files</h4>
              <p className="text-sm text-gray-500">CSV, JSON loaded securely into browser memory.</p>
            </div>
            
            <div className="bg-white border border-blue-200 shadow-[0_0_30px_rgba(59,130,246,0.15)] p-8 rounded-2xl w-64 text-center transform scale-110">
              <LayoutGrid className="mx-auto text-gray-900 mb-4" size={40} />
              <h4 className="font-semibold text-lg mb-2">Foundry Lite</h4>
              <p className="text-sm text-gray-500">React + Vite processing engine. No backend.</p>
            </div>

            <div className="bg-white border border-gray-200 shadow-sm p-8 rounded-2xl w-64 text-center">
              <Bot className="mx-auto text-cyan-600 mb-4" size={40} />
              <h4 className="font-semibold text-lg mb-2">Ollama Engine</h4>
              <p className="text-sm text-gray-500">Local Llama 3.2 analyzing data context securely.</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing / Open Source */}
      <section id="pricing" className="py-32 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">No subscriptions. <br/> Just code.</h2>
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto bg-gradient-to-b from-gray-50 to-white border border-gray-200 rounded-3xl p-8 shadow-xl"
        >
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold">Community Edition</h3>
            <span className="text-blue-700 font-semibold tracking-wide uppercase text-sm bg-blue-100 px-3 py-1 rounded-full">Free</span>
          </div>
          <div className="flex items-baseline gap-1 mb-8">
            <span className="text-5xl font-extrabold">$0</span>
            <span className="text-gray-500">/ forever</span>
          </div>
          
          <ul className="space-y-4 mb-8">
            {['Unlimited datasets', 'Local AI chat (Ollama)', 'Knowledge graph builder', 'Dashboard creation', '100% Data Privacy'].map((feature, i) => (
              <li key={i} className="flex items-center gap-3 text-gray-700">
                <CheckCircle2 size={20} className="text-emerald-600" />
                {feature}
              </li>
            ))}
          </ul>

          <a href="https://github.com" target="_blank" rel="noreferrer" className="block w-full text-center bg-gray-900 text-white py-3 rounded-xl font-bold hover:bg-gray-800 transition-colors">
            Fork on GitHub
          </a>
        </motion.div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-32 px-4 sm:px-6 lg:px-8 max-w-3xl mx-auto border-t border-gray-200">
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div key={i} className="border border-gray-200 rounded-2xl bg-gray-50 overflow-hidden">
              <button 
                onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                className="w-full text-left px-6 py-5 font-medium flex items-center justify-between hover:bg-gray-100 transition-colors"
              >
                {faq.question}
                <ChevronDown className={`transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-blue-600' : 'text-gray-400'}`} />
              </button>
              {openFaq === i && (
                <div className="px-6 pb-5 text-gray-600">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <LayoutGrid size={20} className="text-blue-600" />
            <span className="font-bold text-lg">Foundry Lite</span>
          </div>
          <p className="text-gray-500 text-sm">© {new Date().getFullYear()} Foundry Lite Open Source Project.</p>
          <div className="flex gap-4 text-gray-500">
            <a href="https://github.com" className="hover:text-gray-900 transition-colors"><Code2 size={20} /></a>
          </div>
        </div>
      </footer>

    </div>
  );
}
