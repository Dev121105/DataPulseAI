import React, { useRef, useEffect } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import { Send, Upload, Download, Bot, User, Loader2, BarChart3, ChevronLeft } from 'lucide-react';
import ChartRenderer from './ChartRenderer';
import Logo3D from './components/3d/Logo3D';
import DataCard3D from './components/3d/DataCard3D';
import NeuralBackground from './components/3d/NeuralBackground';
import gsap from 'gsap';

// Makes elements stick to the cursor
const Magnetic = ({ children }) => {
    const ref = useRef(null);
    const rectRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    // Start tracking mouse
    const handleMouseEnter = () => {
        if (ref.current) {
            rectRef.current = ref.current.getBoundingClientRect();
        }
    };

    // Move execution with the mouse
    const handleMouseMove = (e) => {
        if (!rectRef.current) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = rectRef.current;
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        x.set(middleX * 0.35);
        y.set(middleY * 0.35);
    };

    // Reset position when mouse leaves
    const handleMouseLeave = () => {
        x.set(0);
        y.set(0);
        rectRef.current = null;
    };

    return (
        <motion.div
            ref={ref}
            onMouseEnter={handleMouseEnter}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ x: springX, y: springY, display: 'inline-block' }}
        >
            {children}
        </motion.div>
    );
};



// The wiggly line in the footer
const MiniMagneticString = () => {
    return (
        <div
            className="w-full h-8 flex items-center justify-center group/string cursor-pointer mb-2"
            onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width * 1000;
                const y = (e.clientY - rect.top) / rect.height * 100;

                gsap.to(e.currentTarget.querySelector('path'), {
                    attr: { d: `M 0 50 Q ${x} ${y} 1000 50` },
                    duration: 0.3,
                    ease: "power3.Out"
                });
            }}
            onMouseLeave={(e) => {
                gsap.to(e.currentTarget.querySelector('path'), {
                    attr: { d: "M 0 50 Q 500 50 1000 50" },
                    duration: 0.8,
                    ease: "elastic.out(1,0.3)"
                });
            }}
        >
            <svg width="100%" height="100%" viewBox="0 0 1000 100" preserveAspectRatio="none" className="pointer-events-none text-slate-800 group-hover/string:text-orange-400/30 transition-colors duration-500">
                <path d="M 0 50 Q 500 50 1000 50" stroke="currentColor" fill="transparent" strokeWidth="1" />
            </svg>
        </div>
    );
};

// The main chat interface
const ChatbotUI = ({ messages, input, setInput, onSend, onUpload, onDownload, setFile, loading, onBack }) => {
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, loading]);

    const [isDragging, setIsDragging] = React.useState(false);

    // When dragging a file over the window
    const onDragOver = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };

    // When dragging leaves the window
    const onDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };

    // Handling the file drop
    const onDrop = (e) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files && files.length > 0) {
            const f = files[0];
            if (f.name.endsWith('.csv')) {
                setFile(f);
                onUpload(f);
            } else {
                alert("Please drop a CSV file.");
            }
        }
    };

    return (
        <div
            className="flex flex-col h-screen bg-transparent text-slate-100 font-sans relative overflow-hidden"
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
        >
            <NeuralBackground isThinking={loading} />

            {isDragging && (
                <div className="absolute inset-0 z-50 bg-orange-500/20 backdrop-blur-sm border-4 border-orange-500 border-dashed m-2 md:m-4 rounded-3xl flex items-center justify-center animate-pulse pointer-events-none">
                    <div className="bg-black/80 p-8 rounded-3xl border border-orange-500/50 flex flex-col items-center gap-4">
                        <Upload size={48} className="text-orange-500" />
                        <h2 className="text-2xl font-bold text-white">Drop Dataset Here</h2>
                        <p className="text-slate-400">Release to analyze CSV</p>
                    </div>
                </div>
            )
            }
            <header className="px-4 py-3 md:px-6 md:py-4 border-b border-white/5 bg-zinc-950/80 backdrop-blur-xl flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <Magnetic>
                        <motion.button
                            onClick={onBack}
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.95 }}
                            className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                        >
                            <ChevronLeft size={24} className="text-slate-600" />
                        </motion.button>
                    </Magnetic>
                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <div className="absolute inset-[-4px] bg-orange-500/20 rounded-xl blur-lg animate-pulse" />
                            <div className="relativew-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(249,115,22,0.4)] border border-orange-400/30">
                                <Logo3D className="w-10 h-10" isThinking={loading} />
                            </div>
                        </div>
                        <div>
                            <h2 className="font-bold text-slate-800 flex items-center gap-2 text-sm md:text-base">
                                DataPulse AI
                                <span className="hidden md:inline-flex px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-600 text-xs font-medium border border-indigo-100">
                                    Beta
                                </span>
                            </h2>
                            <p className="text-xs text-slate-500 hidden md:flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                                Online & Ready
                            </p>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-2">
                    <Magnetic>
                        <label className="cursor-pointer group flex items-center gap-2 px-2 py-2 md:px-4 bg-orange-500/10 border border-orange-500/20 rounded-xl hover:bg-orange-500/20 transition-all">
                            <Upload size={18} className="text-orange-400 group-hover:scale-110 transition-transform" />
                            <span className="hidden md:inline text-xs font-semibold text-orange-300">Upload CSV</span>
                            <input
                                type="file"
                                accept=".csv"
                                className="hidden"
                                onChange={(e) => {
                                    const f = e.target.files[0];
                                    setFile(f);
                                    if (f) onUpload(f);
                                }}
                            />
                        </label>
                    </Magnetic>
                    <Magnetic>
                        <button onClick={onDownload} className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-white/5 rounded-xl transition-all" title="Download Export">
                            <Download size={18} className="text-slate-300" />
                        </button>
                    </Magnetic>
                </div>
            </header>



            <main ref={scrollRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 md:space-y-8 scroll-smooth custom-scrollbar">
                {messages.length === 0 && !loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, ease: "backOut" }}
                        className="h-full flex flex-col items-center justify-center max-w-sm mx-auto text-center space-y-6"
                    >
                        <div className="w-20 h-20 bg-zinc-900 rounded-3xl flex items-center justify-center border border-white/5 shadow-2xl">
                            <BarChart3 size={40} className="text-orange-500 opacity-50" />
                        </div>
                        <div className="space-y-2">
                            <h2 className="text-xl font-bold">Neural Link Ready</h2>
                            <p className="text-slate-500 text-sm leading-relaxed">Upload a dataset to begin natural language analysis and dynamic visualization.</p>
                        </div>
                    </motion.div>
                )}

                <AnimatePresence mode="popLayout">
                    {messages.map((msg, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            layout
                            transition={{ duration: 0.4, ease: "easeOut" }}
                            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                        >
                            <div className={`flex gap-3 md:gap-4 max-w-full md:max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-white/5 shadow-sm ${msg.role === 'user' ? 'bg-orange-600' : 'bg-zinc-800'}`}>
                                    {msg.role === 'user' ? <User size={16} /> : <Bot size={16} className="text-orange-400" />}
                                </div>

                                <div className={`space-y-4 p-5 rounded-2xl shadow-lg border ${msg.role === 'user'
                                    ? 'bg-orange-950/30 border-orange-500/50 text-white rounded-tr-none'
                                    : 'bg-zinc-900/40 border-white/5 text-slate-200 rounded-tl-none ring-1 ring-white/5'
                                    }`}>
                                    {msg.content && (
                                        <div className="prose prose-invert prose-sm max-w-none">
                                            <ReactMarkdown>
                                                {msg.chart ? msg.content.replace(/```json[\s\S]*?```/g, '').replace(/\{[\s\S]*?\}/g, '').trim() : msg.content}
                                            </ReactMarkdown>
                                        </div>
                                    )}
                                    {msg.chart && (
                                        <div className="py-4">
                                            <DataCard3D className="w-full md:min-w-[500px]">
                                                <div className="h-80">
                                                    <ChartRenderer chartConfig={msg.chart} />
                                                </div>
                                            </DataCard3D>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>

                {loading && (
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                        className="flex justify-start"
                    >
                        <div className="flex gap-4">
                            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center shrink-0 border border-white/5">
                                <Bot size={16} className="text-orange-400" />
                            </div>
                            <div className="bg-zinc-900/40 border border-white/5 p-4 rounded-2xl rounded-tl-none flex items-center gap-3">
                                <Loader2 size={16} className="animate-spin text-orange-500" />
                                <span className="text-xs font-medium text-slate-500 uppercase tracking-widest">Processing...</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </main>

            <footer className="p-4 md:p-6 bg-zinc-950/80 border-t border-white/5 shrink-0">
                <div className="max-w-4xl mx-auto">
                    <MiniMagneticString />
                    <div className="relative">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && onSend()}
                            placeholder="Query dataset..."
                            className="w-full bg-zinc-900/50 border-2 border-white/5 focus:border-orange-500/50 rounded-2xl p-5 pr-16 text-slate-100 placeholder:text-slate-500 outline-none transition-all shadow-2xl focus:ring-4 focus:ring-orange-500/10"
                        />
                        <div className="absolute right-3 top-3 bottom-3 flex items-center">
                            <Magnetic>
                                <button
                                    onClick={onSend}
                                    disabled={!input.trim() || loading}
                                    className="aspect-square h-full bg-orange-600 hover:bg-orange-700 disabled:opacity-50 rounded-xl flex items-center justify-center transition-all hover:scale-105 active:scale-95 shadow-lg shadow-orange-600/20"
                                >
                                    <Send size={20} className="text-white" />
                                </button>
                            </Magnetic>
                        </div>
                    </div>
                </div>
                <p className="text-center text-[10px] text-slate-600 mt-4 uppercase tracking-[0.2em] font-bold">
                    DataPulse AI • Neural Analysis Platform
                </p>
            </footer>
        </div >
    );
};

export default ChatbotUI;
