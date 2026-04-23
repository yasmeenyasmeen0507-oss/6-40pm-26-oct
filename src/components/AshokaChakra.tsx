
interface AshokaChakraProps {
    size?: number;
    className?: string;
    animate?: boolean;
}

const AshokaChakra = ({ size = 60, className = '', animate = true }: AshokaChakraProps) => {
    const spokes = 24;

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={`${animate ? 'animate-spin-slow' : ''} ${className}`}
        >
            {/* Outer circle */}
            <circle
                cx="50"
                cy="50"
                r="48"
                fill="none"
                stroke="hsl(220 70% 35%)"
                strokeWidth="2"
            />

            {/* Inner circle */}
            <circle
                cx="50"
                cy="50"
                r="8"
                fill="hsl(220 70% 35%)"
            />

            {/* 24 Spokes */}
            {Array.from({ length: spokes }, (_, i) => {
                const angle = (i * 360) / spokes;
                const radians = (angle * Math.PI) / 180;
                const x1 = 50 + 10 * Math.cos(radians);
                const y1 = 50 + 10 * Math.sin(radians);
                const x2 = 50 + 46 * Math.cos(radians);
                const y2 = 50 + 46 * Math.sin(radians);

                return (
                    <line
                        key={i}
                        x1={x1}
                        y1={y1}
                        x2={x2}
                        y2={y2}
                        stroke="hsl(220 70% 35%)"
                        strokeWidth="2"
                    />
                );
            })}

            {/* Curved elements between spokes */}
            {Array.from({ length: spokes }, (_, i) => {
                const angle1 = (i * 360) / spokes;
                const angle2 = ((i + 1) * 360) / spokes;
                const midAngle = (angle1 + angle2) / 2;
                const radians = (midAngle * Math.PI) / 180;
                const cx = 50 + 30 * Math.cos(radians);
                const cy = 50 + 30 * Math.sin(radians);

                return (
                    <circle
                        key={`dot-${i}`}
                        cx={cx}
                        cy={cy}
                        r="2"
                        fill="hsl(220 70% 35%)"
                    />
                );
            })}
        </svg>
    );
};

export default AshokaChakra;
