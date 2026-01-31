import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { BarChart3, Bot, Zap, ArrowRight, Table, Download, Mail, MapPin, Github, Twitter, Linkedin, Instagram, ExternalLink, Star, Quote } from 'lucide-react';

gsap.registerPlugin(ScrollTrigger);

const Magnetic = ({ children, className = "" }) => {
    const ref = useRef(null);
    const rectRef = useRef(null);
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const springConfig = { damping: 15, stiffness: 150, mass: 0.1 };
    const springX = useSpring(x, springConfig);
    const springY = useSpring(y, springConfig);

    const handleMouseEnter = () => {
        if (ref.current) {
            rectRef.current = ref.current.getBoundingClientRect();
        }
    };

    const handleMouseMove = (e) => {
        if (!rectRef.current) return;
        const { clientX, clientY } = e;
        const { height, width, left, top } = rectRef.current;
        const middleX = clientX - (left + width / 2);
        const middleY = clientY - (top + height / 2);
        x.set(middleX * 0.35);
        y.set(middleY * 0.35);
    };

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
            style={{ x: springX, y: springY }}
            className={`inline-block ${className}`}
        >
            {children}
        </motion.div>
    );
};

const Marquee = () => {
    const marqueeRef = useRef(null);
    const glowRef = useRef(null);

    useEffect(() => {
        gsap.to(glowRef.current, {
            left: '120%',
            duration: 4,
            repeat: -1,
            ease: "none",
            delay: 1
        });

        const handleWheel = (dets) => {
            if (dets.deltaY > 0) {
                gsap.to(".marque", {
                    transform: "translateX(-200%)",
                    duration: 7,
                    repeat: -1,
                    ease: "none",
                });
                gsap.to(".marquee-arrow", {
                    rotate: 180,
                });
            } else {
                gsap.to(".marque", {
                    transform: "translateX(0%)",
                    duration: 7,
                    repeat: -1,
                    ease: "none",
                });
                gsap.to(".marquee-arrow", {
                    rotate: 0,
                });
            }
        };

        window.addEventListener("wheel", handleWheel);

        gsap.to(".marque", {
            transform: "translateX(-200%)",
            duration: 7,
            repeat: -1,
            ease: "none",
        });

        return () => window.removeEventListener("wheel", handleWheel);
    }, []);

    const ArrowSVG = () => (
        <svg viewBox="0 0 129.9 108.5" className="marquee-arrow h-[5vw] w-auto fill-slate-950">
            <path d="M66.8,2c3.9,0,7.8,0,11.7,0.1C78,22.6,93.3,42,113.2,46.6c3.7,1.2,7.7,1,11.6,1.4c0,3.9,0,7.8,0,11.6   c-7.5,0.4-15.1,1.5-21.7,5.3c-14.8,7.8-24.7,23.9-24.7,40.7c-3.9,0-7.8,0-11.6,0c-0.1-17.9,8.7-35.5,23.2-46.1   c-28.8,0.1-57.7,0-86.5,0c0.1-3.8,0.1-7.7,0-11.6C32.2,48.2,61,48,89.8,48.1c-10.1-8-18.2-18.9-21.2-31.5   C67.4,11.9,66.9,6.9,66.8,2z" />
        </svg>
    );

    const RepeatingContent = () => (
        <>
            <h1 className="text-[6vw] font-black uppercase tracking-tighter text-slate-950">Neural Evolution</h1>
            <ArrowSVG />
            <h1 className="text-[6vw] font-black uppercase tracking-tighter text-slate-950">Scalable Insights</h1>
            <ArrowSVG />
            <h1 className="text-[6vw] font-black uppercase tracking-tighter text-slate-950">DataStream Protocol</h1>
            <ArrowSVG />
        </>
    );

    return (
        <div ref={marqueeRef} className="bg-orange-500 py-[2vw] flex overflow-hidden border-y border-white/10 my-20 relative">
            {/* Moving Glow Sweep */}
            <div
                ref={glowRef}
                className="absolute top-0 -left-[20%] w-[40%] h-full bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[30deg] pointer-events-none z-10"
            />

            <div className="marque flex-shrink-0 flex items-center gap-[3vw] px-[1.5vw] translate-x-[-100%] focus:no-underline">
                <RepeatingContent />
            </div>
            <div className="marque flex-shrink-0 flex items-center gap-[3vw] px-[1.5vw] translate-x-[-100%]">
                <RepeatingContent />
            </div>
            <div className="marque flex-shrink-0 flex items-center gap-[3vw] px-[1.5vw] translate-x-[-100%]">
                <RepeatingContent />
            </div>
            <div className="marque flex-shrink-0 flex items-center gap-[3vw] px-[1.5vw] translate-x-[-100%]">
                <RepeatingContent />
            </div>
        </div>
    );
};

const Loader = ({ onComplete }) => {
    const loaderRef = useRef(null);
    const logoRef = useRef(null);

    useEffect(() => {
        const tl = gsap.timeline({
            onComplete: onComplete
        });


        gsap.set(logoRef.current, {
            top: "50%",
            left: "50%",
            xPercent: -50,
            yPercent: -50,
            opacity: 0,
            y: 100,
            scale: 1.5
        });

        tl.to(logoRef.current, {
            opacity: 1,
            y: -100,
            duration: 1,
            ease: "bounce.out"
        })
            .to(logoRef.current, {
                scale: 1.8,
                duration: 0.8,
                ease: "power2.inOut"
            }, "+=0.2")
            .to(logoRef.current, {
                top: "46px",
                left: "130px",
                xPercent: -50,
                yPercent: -50,
                x: 0,
                y: 0,
                scale: 0.714,
                duration: 1.5,
                ease: "bounce.out"
            }, "+=0.3")
            .to(loaderRef.current, {
                backgroundColor: "rgba(0,0,0,0)",
                duration: 0.8,
                ease: "power2.inOut"
            }, "-=0.4");

        return () => tl.kill();
    }, [onComplete]);

    return (
        <div ref={loaderRef} className="fixed inset-0 z-[100] bg-black flex items-center justify-center">
            <div ref={logoRef} className="fixed flex items-center gap-3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                <div className="relative">
                    <div className="absolute inset-[-8px] bg-orange-500/20 rounded-2xl blur-2xl animate-pulse" />
                    <div className="absolute inset-[-4px] bg-orange-400/10 rounded-2xl blur-xl animate-pulse delay-75" />

                    <div className="relative w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.6)] border border-orange-400/30">
                        <Bot size={32} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                    </div>
                </div>
                <span className="text-3xl font-black tracking-tighter text-white">DATAPULSE AI</span>
            </div>
        </div>
    );
};

const LandingPage = ({ onStart }) => {
    const [isLoading, setIsLoading] = React.useState(true);
    const [rating, setRating] = React.useState(0);
    const [hoverRating, setHoverRating] = React.useState(0);
    const [review, setReview] = React.useState("");
    const [submitted, setSubmitted] = React.useState(false);
    const containerRef = useRef(null);

    useEffect(() => {
        if (isLoading) return;
        window.scrollTo(0, 0);

        const ctx = gsap.context(() => {
            gsap.from('.nav-link', {
                opacity: 0,
                y: -20,
                stagger: 0.1,
                duration: 0.8,
                ease: "power3.out"
            });

            gsap.from('.nav-action', {
                opacity: 0,
                scale: 0.8,
                duration: 0.8,
                ease: "back.out(1.7)"
            });

            gsap.fromTo('.hero-content > p, .hero-content > div:last-child',
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1.2,
                    stagger: 0.2,
                    ease: 'power4.out',
                    delay: 1.0
                }
            );


            gsap.from('.feature-card', {
                scrollTrigger: {
                    trigger: '#features',
                    start: 'top 85%',
                    once: true
                },
                y: 50,
                opacity: 1,
                duration: 1,
                stagger: 0.2,
                ease: 'power3.out'
            });

            gsap.from('.showcase-mockup', {
                scrollTrigger: {
                    trigger: '#showcase',
                    start: 'top 75%',
                    once: true
                },
                scale: 0.9,
                y: 60,
                opacity: 0,
                duration: 1.2,
                ease: 'power4.out'
            });

            gsap.from('.showcase-text > *', {
                scrollTrigger: {
                    trigger: '#showcase',
                    start: 'top 70%',
                    once: true
                },
                x: -30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.15,
                ease: 'power3.out'
            });
            gsap.from('#string', {
                scrollTrigger: {
                    trigger: '#string',
                    start: 'top 90%',
                    once: true
                },
                opacity: 0,
                y: 40,
                duration: 1,
                ease: 'power3.out'
            });

            gsap.from('footer > div > div > *', {
                scrollTrigger: {
                    trigger: 'footer',
                    start: 'top 80%',
                    once: true
                },
                y: 30,
                opacity: 0,
                duration: 0.8,
                stagger: 0.1,
                ease: 'power3.out'
            });
        }, containerRef);

        return () => ctx.revert();
    }, [isLoading]);

    const capabilityColors = {
        orange: {
            bg: 'bg-orange-600/10',
            border: 'border-orange-500/20',
            text: 'text-orange-500',
            glow: 'group-hover:shadow-orange-500/20'
        },
        emerald: {
            bg: 'bg-emerald-600/10',
            border: 'border-emerald-500/20',
            text: 'text-emerald-500',
            glow: 'group-hover:shadow-emerald-500/20'
        },
        amber: {
            bg: 'bg-amber-600/10',
            border: 'border-amber-500/20',
            text: 'text-amber-500',
            glow: 'group-hover:shadow-amber-500/20'
        }
    };

    return (
        <div ref={containerRef} className="min-h-screen text-slate-100 selection:bg-orange-500/30 overflow-x-hidden font-sans">
            {isLoading && <Loader onComplete={() => setIsLoading(false)} />}

            <div className={`fixed inset-0 overflow-hidden pointer-events-none -z-10 transition-opacity duration-1000 bg-black ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                <motion.div
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 50, 0],
                        y: [0, 30, 0],
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                    style={{ willChange: "transform" }}
                    className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-orange-500/10 blur-[120px] rounded-full"
                />
                <motion.div
                    animate={{
                        scale: [1, 1.3, 1],
                        x: [0, -60, 0],
                        y: [0, -40, 0],
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear",
                        delay: 2
                    }}
                    style={{ willChange: "transform" }}
                    className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-emerald-500/5 blur-[120px] rounded-full"
                />
            </div>

            <nav className={`fixed top-0 w-full z-50 px-8 py-6 flex justify-between items-center backdrop-blur-xl border-b border-white/5 bg-black/50 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>
                <div className="flex items-center gap-3 group cursor-pointer">
                    <div className="relative">
                        {/* Neural Glow Aura */}
                        <div className="absolute inset-[-8px] bg-orange-500/20 rounded-2xl blur-2xl animate-pulse" />
                        <div className="absolute inset-[-4px] bg-orange-400/10 rounded-2xl blur-xl animate-pulse delay-75" />

                        <div className="relative w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.6)] border border-orange-400/30 group-hover:rotate-12 transition-transform">
                            <Bot size={24} className="text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                        </div>
                    </div>
                    <span className="text-xl font-black tracking-tighter text-white">DATAPULSE AI</span>
                </div>
                <div className="hidden md:flex items-center gap-8 text-sm font-bold text-slate-400 uppercase tracking-widest">
                    <a href="#features" className="nav-link hover:text-white transition-colors">Features</a>
                    <a href="#showcase" className="nav-link hover:text-white transition-colors">Experience</a>
                    <a href="#contact" className="nav-link hover:text-white transition-colors">Contact</a>
                </div>
                <div className="nav-action">
                    <Magnetic>
                        <button onClick={onStart} className="btn-wave-fill bg-white text-slate-950 px-8 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-105 active:scale-95 shadow-xl shadow-white/10">
                            LAUNCH PLATFORM
                        </button>
                    </Magnetic>
                </div>
            </nav>

            <section className="relative pt-44 pb-32 px-6">
                <div className="max-w-[90rem] mx-auto text-center hero-content">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={!isLoading ? {
                            opacity: 1,
                            y: 0,
                            boxShadow: ["0 0 0px rgba(249,115,22,0)", "0 0 20px rgba(249,115,22,0.3)", "0 0 0px rgba(249,115,22,0)"]
                        } : {}}
                        transition={{
                            opacity: { duration: 1, delay: 0.5 },
                            y: { duration: 1, delay: 0.5 },
                            boxShadow: { duration: 2, repeat: Infinity, delay: 1.5 }
                        }}
                        className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 border border-white/10 text-slate-300 text-xs font-bold uppercase tracking-widest mb-10"
                    >
                        <Zap size={14} className="text-orange-400" />
                        <span>Intelligence Redefined</span>
                    </motion.div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-10 tracking-[-0.05em] leading-[0.9] text-white group cursor-default pb-4">
                        <span className="inline-flex gap-1 mr-4">
                            {["D", "A", "T", "A"].map((char, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                    animate={!isLoading ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                                    transition={{ delay: 0.8 + i * 0.15, duration: 0.8 }}
                                    className="inline-block transition-all duration-700 group-hover:drop-shadow-[0_0_50px_rgba(255,255,255,0.3)] group-hover:text-orange-100"
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </span> <br />
                        <span className="inline-flex">
                            {["E", "V", "O", "L", "V", "E", "D", "."].map((char, i) => (
                                <motion.span
                                    key={i}
                                    initial={{ opacity: 0, y: 20, filter: "blur(10px)" }}
                                    animate={!isLoading ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                                    transition={{ delay: 1.4 + i * 0.1, duration: 0.8 }}
                                    className="inline-block text-transparent bg-clip-text bg-gradient-to-b from-orange-200 to-orange-600 transition-all duration-700 group-hover:drop-shadow-[0_0_50px_rgba(249,115,22,0.5)]"
                                >
                                    {char}
                                </motion.span>
                            ))}
                        </span>
                    </h1>
                    <p className="opacity-0 text-slate-500 text-xl md:text-2xl max-w-2xl mx-auto mb-16 leading-relaxed font-medium">Direct dataset interaction. High-fidelity visualizations and deep neural insights in seconds.</p>
                    <div className="opacity-0">
                        <Magnetic>
                            <button onClick={onStart} className="btn-wave-fill2 group w-full md:w-auto bg-orange-600 text-white px-14 py-7 rounded-[2rem] font-black text-xl flex items-center justify-center gap-4 transition-all hover:scale-105 shadow-2xl shadow-orange-600/40">
                                START ANALYZING <ArrowRight size={24} className="group-hover:translate-x-2 transition-transform" />
                            </button>
                        </Magnetic>
                    </div>
                </div>
            </section>

            <section id="showcase" className="py-40 px-6 relative">
                <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                    <div className="showcase-text space-y-10 order-2 lg:order-1 text-left">
                        <h2 className="text-5xl md:text-7xl font-black tracking-tighter text-white leading-none">
                            THE NEXT GENERATION <br />
                            <span className="text-orange-500">INTERFACE.</span>
                        </h2>
                        <div className="space-y-8">
                            {[
                                { icon: <Table size={24} />, title: "Precision Parsing", desc: "Automated CSV normalization and surgical cleaning logic." },
                                { icon: <Bot size={24} />, title: "Neural Queries", desc: "Natural language intent translated into complex SQL operations." },
                                { icon: <BarChart3 size={24} />, title: "Dynamic VIZ", desc: "Context-aware visualizations rendered in real-time." }
                            ].map((f, i) => (
                                <div key={i} className="flex gap-6 group">
                                    <div className="w-12 h-12 rounded-xl border border-white/10 flex items-center justify-center transition-all group-hover:border-orange-500/50 group-hover:shadow-2xl group-hover:shadow-orange-500/10">
                                        <div className="text-orange-400">
                                            {f.icon}
                                        </div>
                                    </div>
                                    <div>
                                        <h4 className="text-xl font-bold text-white mb-2">{f.title}</h4>
                                        <p className="text-slate-500 leading-relaxed font-medium">{f.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="showcase-mockup order-1 lg:order-2">
                        <div className="relative group p-2 bg-gradient-to-br from-orange-500/20 to-transparent rounded-[2.5rem] border border-white/10 shadow-2xl overflow-hidden backdrop-blur-3xl hover:border-orange-500/40 hover:shadow-[0_0_80px_rgba(249,115,22,0.15)] transition-all duration-500">
                            <div className="bg-slate-950 rounded-[2rem] overflow-hidden aspect-[4/3] relative group-hover:scale-[1.005] transition-transform duration-700">
                                <div className="absolute inset-0 p-8 space-y-6 opacity-40">
                                    <div className="flex gap-4">
                                        <div className="w-8 h-8 rounded-lg bg-orange-600" />
                                        <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none w-2/3 space-y-2">
                                            <div className="h-2 w-full bg-white/10 rounded" />
                                            <div className="h-2 w-3/4 bg-white/10 rounded" />
                                        </div>
                                    </div>
                                    <div className="flex gap-4 flex-row-reverse">
                                        <div className="w-8 h-8 rounded-lg bg-slate-800" />
                                        <div className="bg-orange-600 p-4 rounded-2xl rounded-tr-none w-1/2">
                                            <div className="h-2 w-full bg-white/20 rounded" />
                                        </div>
                                    </div>
                                    <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-6 h-40 flex items-end gap-2 pr-12">
                                        <div className="flex-1 bg-orange-500/50 h-[30%] rounded-t-lg" />
                                        <div className="flex-1 bg-orange-500/70 h-[60%] rounded-t-lg" />
                                        <div className="flex-1 bg-orange-500 h-[85%] rounded-t-lg shadow-[0_0_20px_rgba(249,115,22,0.5)]" />
                                        <div className="flex-1 bg-orange-500/60 h-[45%] rounded-t-lg" />
                                    </div>
                                </div>
                                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full duration-1000 transition-transform" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <Marquee />

            <section id="features" className="py-40 px-6 relative">
                <div id="features-trigger" className="absolute top-20 pointer-events-none" />
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-24">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tight text-white mb-6 uppercase">Core Capabilities</h2>
                        <p className="text-slate-500 font-bold uppercase tracking-widest text-sm">Engineered for professional performance</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            { icon: <Zap size={28} />, label: "REALTIME", color: "orange" },
                            { icon: <Table size={28} />, label: "STRUCTURED", color: "emerald" },
                            { icon: <Download size={28} />, label: "PERSISTENT", color: "amber" }
                        ].map((item, i) => {
                            const colors = capabilityColors[item.color];
                            return (
                                <motion.div
                                    key={i}
                                    whileHover={{ y: -10 }}
                                    className={`feature-card p-12 rounded-[3.5rem] bg-slate-900/80 border border-white/10 hover:bg-slate-900/90 backdrop-blur-xl transition-all text-center group cursor-default hover:border-orange-500/30 hover:shadow-2xl ${colors.glow}`}
                                >
                                    <div className={`w-20 h-20 mx-auto mb-8 ${colors.bg} rounded-[2rem] flex items-center justify-center border ${colors.border} group-hover:scale-110 group-hover:rotate-6 transition-all`}>
                                        <div className={colors.text}>{item.icon}</div>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-4 tracking-tight">{item.label} DATA</h3>
                                    <p className="text-slate-500 font-medium leading-relaxed">Advanced algorithms ensure your data is processed with surgical precision and absolute clarity.</p>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </section>

            <div
                id="string"
                className="relative w-full h-[200px] mb-[-4rem] flex items-center justify-center group/string cursor-pointer"
                onClick={onStart}
                onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;

                    const normalizedX = (x / rect.width) * 1000;
                    const normalizedY = (y / rect.height) * 200;

                    gsap.to(e.currentTarget.querySelector('path'), {
                        attr: { d: `M 10 100 Q ${normalizedX} ${normalizedY} 990 100` },
                        duration: 0.3,
                        ease: "power3.Out"
                    });

                    gsap.to(e.currentTarget.querySelector('.neural-label'), {
                        x: x - rect.width / 2,
                        y: y - rect.height / 2,
                        xPercent: -50,
                        yPercent: -50,
                        duration: 0.3,
                        ease: "power3.Out"
                    });
                }}
                onMouseLeave={(e) => {
                    gsap.to(e.currentTarget.querySelector('path'), {
                        attr: { d: "M 10 100 Q 500 100 990 100" },
                        duration: 0.8,
                        ease: "elastic.out(1,0.3)"
                    });

                    gsap.to(e.currentTarget.querySelector('.neural-label'), {
                        x: 0,
                        y: 0,
                        xPercent: -50,
                        yPercent: -50,
                        duration: 0.8,
                        ease: "elastic.out(1,0.3)"
                    });
                }}
            >
                <div className="neural-label absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
                    <div className="px-8 py-10 bg-slate-950/80 backdrop-blur-md border border-white/5 rounded-full text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 group-hover/string:text-orange-400 group-hover/string:border-orange-500/20 group-hover/string:shadow-[0_0_30px_rgba(249,115,22,0.1)] transition-all duration-700 whitespace-nowrap">
                        Connect to AI Chat
                    </div>
                </div>
                <svg width="100%" height="200" viewBox="0 0 1000 200" preserveAspectRatio="none" className="pointer-events-none text-slate-800 group-hover/string:text-orange-400/50 transition-colors duration-500">
                    <path d="M 10 100 Q 500 100 990 100" stroke="currentColor" fill="transparent" strokeWidth="2" />
                </svg>
            </div>







            <footer id="contact" className="pt-32 pb-20 border-t border-white/5 bg-black px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-24">
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 group cursor-default">
                                <div className="relative w-10 h-10 bg-orange-600 rounded-xl flex items-center justify-center shadow-[0_0_50px_rgba(249,115,22,0.6)] border border-orange-400/30 group-hover:rotate-12 transition-transform">
                                    <Bot size={24} className="text-white" />
                                </div>
                                <span className="text-xl font-black tracking-tighter text-white">DATAPULSE AI</span>
                            </div>
                            <p className="text-slate-500 font-medium leading-relaxed max-w-xs">
                                High-performance neural analysis platform engineered for the next generation of data-driven decisions.
                            </p>
                            <div className="flex gap-4">
                                {[Github, Instagram].map((Icon, i) => (
                                    <Magnetic key={i}>
                                        <a href="#" className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:border-orange-500/50 hover:bg-orange-500/10 transition-all">
                                            <Icon size={18} />
                                        </a>
                                    </Magnetic>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-8">
                            <h4 className="text-sm font-black uppercase tracking-widest text-white flex items-center gap-2">
                                <Star size={16} className="text-amber-500 fill-amber-500" />
                                Submit Feedback
                            </h4>

                            <AnimatePresence mode="wait">
                                {!submitted ? (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20, transition: { duration: 0.2 } }}
                                        transition={{ duration: 0.4 }}
                                        className="space-y-6 bg-white/5 border border-white/10 p-6 rounded-[2rem] hover:border-orange-500/30 transition-all"
                                    >
                                        <div className="flex gap-2">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <motion.button
                                                    key={s}
                                                    whileHover={{ scale: 1.2 }}
                                                    whileTap={{ scale: 0.9 }}
                                                    onMouseEnter={() => setHoverRating(s)}
                                                    onMouseLeave={() => setHoverRating(0)}
                                                    onClick={() => setRating(s)}
                                                    className="transition-transform"
                                                >
                                                    <Star
                                                        size={24}
                                                        className={`transition-all ${s <= (hoverRating || rating)
                                                            ? 'text-amber-500 fill-amber-500 shadow-[0_0_15px_rgba(245,158,11,0.4)]'
                                                            : 'text-slate-600'
                                                            }`}
                                                    />
                                                </motion.button>
                                            ))}
                                        </div>
                                        <textarea
                                            value={review}
                                            onChange={(e) => setReview(e.target.value)}
                                            placeholder="Share your experience..."
                                            className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-xs text-slate-300 placeholder:text-slate-600 outline-none focus:border-orange-500/50 transition-all resize-none h-24"
                                        />
                                        <Magnetic className="w-full">
                                            <button
                                                onClick={() => {
                                                    if (rating && review.trim()) setSubmitted(true);
                                                }}
                                                disabled={!rating || !review.trim()}
                                                className="btn-wave-fill w-full py-3 bg-orange-600 hover:bg-orange-500 disabled:opacity-50 disabled:hover:bg-orange-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest transition-all hover:shadow-[0_0_20px_rgba(249,115,22,0.4)]"
                                            >
                                                Submit Feedback
                                            </button>
                                        </Magnetic>
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="bg-orange-500/10 border border-orange-500/30 p-8 rounded-[2.5rem] text-center space-y-4"
                                    >
                                        <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center mx-auto shadow-[0_0_20px_rgba(249,115,22,0.5)]">
                                            <Zap size={24} className="text-white" />
                                        </div>
                                        <p className="text-white font-black uppercase tracking-tighter">DATA RECEIVED</p>
                                        <p className="text-slate-400 text-[10px] font-medium leading-relaxed">Your neural feedback has been synchronized with our core processors.</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-sm font-black uppercase tracking-widest text-white">Resources</h4>
                            <ul className="space-y-4">
                                {['Documentation', 'API Reference', 'Community', 'Status'].map((item) => (
                                    <li key={item}>
                                        <a href="#" className="text-slate-500 hover:text-orange-400 transition-colors font-medium">{item}</a>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="space-y-6">
                            <h4 className="text-sm font-black uppercase tracking-widest text-white">Contact</h4>
                            <div className="space-y-4">
                                <a href="mailto:datapulse.ai@gmail.com" className="flex items-center gap-4 group">
                                    <div className="w-10 h-10 bg-white/5 border border-white/10 rounded-lg flex items-center justify-center text-orange-400 group-hover:bg-orange-500/10 group-hover:border-orange-500/50 transition-all">
                                        <Mail size={18} />
                                    </div>
                                    <div>
                                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Email Us</p>
                                        <p className="text-slate-200 font-bold text-xs">datapulse.ai@gmail.com</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
                        <p className="text-slate-600 font-bold text-[10px] uppercase tracking-widest">
                            © 2026 PLATFORM CORE • LICENSED FOR PROFESSIONAL USE
                        </p>
                        <div className="flex gap-8 text-[10px] font-black text-slate-600 uppercase tracking-widest">
                            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
                            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
