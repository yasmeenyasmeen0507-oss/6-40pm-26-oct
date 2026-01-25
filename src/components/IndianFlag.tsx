
import AshokaChakra from './AshokaChakra';

interface IndianFlagProps {
    size?: 'sm' | 'md' | 'lg';
    className?: string;
    waving?: boolean;
}

const IndianFlag = ({ size = 'md', className = '', waving = true }: IndianFlagProps) => {
    const dimensions = {
        sm: { width: 60, height: 40 },
        md: { width: 90, height: 60 },
        lg: { width: 150, height: 100 },
    };

    const { width, height } = dimensions[size];
    const stripeHeight = height / 3;

    return (
        <div className={`relative ${waving ? 'animate-wave-flag' : ''} ${className}`}>
            <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
                {/* Saffron stripe */}
                <rect x="0" y="0" width={width} height={stripeHeight} fill="hsl(24 100% 50%)" />

                {/* White stripe */}
                <rect x="0" y={stripeHeight} width={width} height={stripeHeight} fill="hsl(0 0% 100%)" />

                {/* Green stripe */}
                <rect x="0" y={stripeHeight * 2} width={width} height={stripeHeight} fill="hsl(120 60% 25%)" />
            </svg>

            {/* Ashoka Chakra centered on white stripe */}
            <div
                className="absolute"
                style={{
                    top: stripeHeight + (stripeHeight - stripeHeight * 0.7) / 2,
                    left: (width - stripeHeight * 0.7) / 2,
                }}
            >
                <AshokaChakra size={stripeHeight * 0.7} animate={false} />
            </div>
        </div>
    );
};

export default IndianFlag;
