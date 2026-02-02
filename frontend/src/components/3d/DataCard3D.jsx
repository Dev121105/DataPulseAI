import React from 'react';
import Tilt from 'react-parallax-tilt';

// A 3D tilting card for the charts
const DataCard3D = ({ children, className = "" }) => {
    return (
        <Tilt
            tiltMaxAngleX={5}
            tiltMaxAngleY={5}
            perspective={1000}
            scale={1.02}
            transitionSpeed={1000}
            className={`transform-gpu ${className}`}
        >
            <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/20 to-indigo-500/20 rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-1000 group-hover:duration-200" />

                <div className="relative h-full bg-slate-950/40 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl ring-1 ring-white/5 group-hover:border-orange-500/30 transition-all duration-300">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                    <div className="relative z-10">
                        {children}
                    </div>
                </div>
            </div>
        </Tilt>
    );
};

export default DataCard3D;
