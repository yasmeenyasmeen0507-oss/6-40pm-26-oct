const FloatingIcons = () => {
    const icons = [
        { top: "15%", left: "5%", delay: "0s", size: 40 },
        { top: "25%", right: "8%", delay: "1s", size: 36 },
        { top: "60%", left: "3%", delay: "2s", size: 32 },
        { top: "70%", right: "5%", delay: "0.5s", size: 38 },
        { top: "40%", left: "8%", delay: "1.5s", size: 28 },
        { top: "50%", right: "3%", delay: "2.5s", size: 34 },
    ];

    return (
        <>
            {icons.map((pos, i) => (
                <div
                    key={i}
                    className="absolute animate-float text-ramzan-gold z-20 pointer-events-none"
                    style={{
                        top: pos.top,
                        left: pos.left,
                        right: pos.right,
                        animationDelay: pos.delay,
                    }}
                >
                    {i % 3 === 0 ? (
                        // Lantern
                        <svg width={pos.size} height={pos.size} viewBox="0 0 64 64" fill="currentColor" opacity="0.7">
                            <path d="M28 4h8v4h-8zM24 8h16v4H24zM20 12h24c0 0 4 8 4 20s-4 20-4 20H20s-4-8-4-20 4-20 4-20zM26 52h12v4H26zM30 56h4v4h-4z" />
                            <circle cx="32" cy="28" r="4" fill="hsl(40, 100%, 80%)" />
                        </svg>
                    ) : i % 3 === 1 ? (
                        // Crescent and Star
                        <svg width={pos.size} height={pos.size} viewBox="0 0 64 64" fill="currentColor" opacity="0.7">
                            <path d="M32 8C18.7 8 8 18.7 8 32s10.7 24 24 24c4.4 0 8.5-1.2 12-3.2-5.7-3.3-9.6-9.5-9.6-16.8s3.9-13.5 9.6-16.8C40.5 9.2 36.4 8 32 8z" />
                            <polygon points="52,12 54,18 60,18 55,22 57,28 52,24 47,28 49,22 44,18 50,18" />
                        </svg>
                    ) : (
                        // Star pattern
                        <svg width={pos.size} height={pos.size} viewBox="0 0 64 64" fill="currentColor" opacity="0.6">
                            <polygon points="32,4 38,24 58,24 42,36 48,56 32,44 16,56 22,36 6,24 26,24" />
                        </svg>
                    )}
                </div>
            ))}
        </>
    );
};

export default FloatingIcons;
