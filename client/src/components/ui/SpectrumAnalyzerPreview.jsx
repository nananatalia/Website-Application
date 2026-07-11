// components/ui/SpectrumAnalyzerPreview.jsx

const ROWS = 16

function getColorForRow(row, colors) {
    const ratio = row / (ROWS - 1)
    if (ratio < 0.4) return colors.color1
    if (ratio < 0.65) return colors.color2
    if (ratio < 0.85) return colors.color3
    return colors.color4
}

export default function SpectrumAnalyzerPreview({ colors, frequencies }) {
    return (
        <div className='relative bg-zinc-900 p-4 rounded-xl border border-zinc-800 shadow-2xl'>
            <div className='border border-zinc-950 rounded bg-[rgba(61,61,61,0.363)] p-3'>
                <div className='flex items-end justify-center gap-1.5 h-48 w-full'>
                    {frequencies.map((value, colIndex) => {
                        const activeRows = Math.round((value / 100) * ROWS)
                        return (
                            <div
                                key={colIndex}
                                className='flex-1 h-full flex flex-col-reverse gap-[2px]'
                            >
                                {Array.from({ length: ROWS }).map((_, row) => (
                                    <div
                                        key={row}
                                        className='w-full rounded-sm'
                                        style={{
                                            height: `${100 / ROWS}%`,
                                            backgroundColor: row < activeRows
                                                ? getColorForRow(row, colors)
                                                : 'rgba(255,255,255,0.04)',
                                        }}
                                    />
                                ))}
                            </div>
                        )
                    })}
                </div>
            </div>
        </div>
    )
}