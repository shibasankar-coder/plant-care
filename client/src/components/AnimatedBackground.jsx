import React, { useEffect, useState } from 'react';

const AnimatedBackground = () => {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePosition({
                x: (e.clientX / window.innerWidth - 0.5) * 40,
                y: (e.clientY / window.innerHeight - 0.5) * 40,
            });
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, []);

    return (
        <div className="fixed inset-0 z-[-1] overflow-hidden bg-slate-50">
            {/* Base gradient mesh */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_var(--tw-gradient-stops))] from-emerald-100/50 via-slate-50 to-teal-50/50"></div>
            
            {/* Interactive floating blobs */}
            <div className="absolute w-full h-full transition-transform duration-700 ease-out" style={{ transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)` }}>
                <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-emerald-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
            </div>
            
            <div className="absolute w-full h-full transition-transform duration-1000 ease-out" style={{ transform: `translate(${-mousePosition.x * 1.2}px, ${-mousePosition.y * 1.2}px)` }}>
                <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] bg-teal-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
            </div>

            <div className="absolute w-full h-full transition-transform duration-1000 ease-out" style={{ transform: `translate(${mousePosition.x * 0.8}px, ${-mousePosition.y * 0.8}px)` }}>
                <div className="absolute bottom-[-20%] left-[20%] w-[700px] h-[700px] bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>
            
            {/* Grain overlay for a more premium texture */}
            <div className="absolute inset-0 opacity-[0.03] bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyMDAgMjAwIj48ZmlsdGVyIGlkPSJuIj48ZmVUdXJidWxlbmNlIHR5cGU9ImZyYWN0YWxOb2lzZSIgYmFzZUZyZXF1ZW5jeT0iMC44IiBudW1PY3RhdmVzPSIzIiBzdGl0Y2hUaWxlcz0ic3RpdGNoIi8+PC9maWx0ZXI+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsdGVyPSJ1cmwoI24pIiBvcGFjaXR5PSIwLjUiLz48L3N2Zz4=')]"></div>
        </div>
    );
};

export default AnimatedBackground;
