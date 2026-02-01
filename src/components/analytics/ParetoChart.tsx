import React from 'react';

interface ParetoChartProps {
    data: { label: string, value: number, cumulativePercent: number }[];
    isDarkMode: boolean;
}

export const ParetoChart: React.FC<ParetoChartProps> = ({ data, isDarkMode }) => {
    const width = 300;
    const height = 150;
    const padding = 30;
    const maxVal = Math.max(...data.map(d => d.value), 1);
    const barWidth = (width - 2 * padding) / data.length;
    const linePoints = data.map((d, i) => {
        const x = i * barWidth + padding + barWidth / 2;
        const y = height - padding - (d.cumulativePercent / 100) * (height - 2 * padding);
        return `${x},${y}`;
    }).join(' ');

    return (
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-48 overflow-visible">
            {[0, 25, 50, 75, 100].map(v => (
                <line key={v} x1={padding} y1={height - padding - (v / 100) * (height - 2 * padding)} x2={width - padding} y2={height - padding - (v / 100) * (height - 2 * padding)} stroke={isDarkMode ? '#334155' : '#E2E8F0'} strokeWidth="0.5" strokeDasharray="4 4" />
            ))}
            {data.map((d, i) => {
                const barHeight = (d.value / maxVal) * (height - 2 * padding);
                const x = i * barWidth + padding;
                const y = height - padding - barHeight;
                return (
                    <g key={d.label}>
                        <rect x={x + 2} y={y} width={barWidth - 4} height={barHeight} fill="#2563EB" rx="2" className="opacity-90 hover:opacity-100 transition-all" />
                        <text x={x + barWidth / 2} y={height - padding + 10} textAnchor="middle" className="text-[5px] fill-slate-400 font-bold uppercase" transform={`rotate(45, ${x + barWidth / 2}, ${height - padding + 10})`}>{d.label.length > 8 ? d.label.substring(0, 8) + '..' : d.label}</text>
                    </g>
                );
            })}
            <polyline fill="none" stroke="#F43F5E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" points={linePoints} className="drop-shadow-md" />
            {data.map((d, i) => {
                const x = i * barWidth + padding + barWidth / 2;
                const y = height - padding - (d.cumulativePercent / 100) * (height - 2 * padding);
                return <circle key={`dot-${i}`} cx={x} cy={y} r="2.5" fill="#F43F5E" />;
            })}
            <text x={width - 5} y={padding} textAnchor="end" className="text-[6px] fill-rose-500 font-black italic">100%</text>
            <text x={width - 5} y={height - padding} textAnchor="end" className="text-[6px] fill-rose-500 font-black italic">0%</text>
        </svg>
    );
};
