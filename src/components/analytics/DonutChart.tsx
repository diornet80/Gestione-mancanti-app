import React from 'react';

interface DonutChartProps {
    data: { label: string, value: number }[];
    isDarkMode: boolean;
}

export const DonutChart: React.FC<DonutChartProps> = ({ data, isDarkMode }) => {
    const total = data.reduce((acc, curr) => acc + curr.value, 0);
    let cumulativePercent = 0;
    function getCoordinatesForPercent(percent: number) {
        const x = Math.cos(2 * Math.PI * percent);
        const y = Math.sin(2 * Math.PI * percent);
        return [x, y];
    }
    const colors = ['#2563EB', '#F59E0B', '#10B981'];
    return (
        <svg viewBox="-1.2 -1.2 2.4 2.4" className="w-full h-full max-h-48 drop-shadow-lg">
            {data.map((slice, i) => {
                if (slice.value === 0) return null;
                const [startX, startY] = getCoordinatesForPercent(cumulativePercent);
                cumulativePercent += slice.value / total;
                const [endX, endY] = getCoordinatesForPercent(cumulativePercent);
                const largeArcFlag = slice.value / total > 0.5 ? 1 : 0;
                const pathData = [`M ${startX} ${startY}`, `A 1 1 0 ${largeArcFlag} 1 ${endX} ${endY}`, `L 0 0`].join(' ');
                return <path key={slice.label} d={pathData} fill={colors[i % colors.length]} className="transition-all hover:opacity-80" />;
            })}
            <circle cx="0" cy="0" r="0.6" fill={isDarkMode ? '#0F172A' : '#FFFFFF'} />
            <text x="0" y="0.1" textAnchor="middle" className={`text-[0.4px] font-black italic ${isDarkMode ? 'fill-slate-100' : 'fill-slate-900'}`}>{total}</text>
        </svg>
    );
};
