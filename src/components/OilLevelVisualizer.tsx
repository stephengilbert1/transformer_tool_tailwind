import { useEffect, useState } from "react";

type OilLevelVisualizerProps = {
  ambientOilLevel: number; // in meters
  hotOilLevel: number; // in meters
  ambientTemp: number; // In C
  hotTemp: number;
  tankHeightMeters: number;
  tankWidthMeters: number;
};

export default function OilLevelVisualizer({
  ambientOilLevel,
  hotOilLevel,
  ambientTemp,
  hotTemp,
  tankHeightMeters,
  tankWidthMeters,
}: OilLevelVisualizerProps) {
  const topPadding = 40; // extra space for labels (in pixels)
  const tankDisplayHeight = 400; // Or optionally base this on containerRef if you want 1:1 matching.

  const scale = tankDisplayHeight / tankHeightMeters;
  const tankDisplayWidth = tankWidthMeters * scale;
  const leftPadding = 20;
  const rightPadding = 100;
  const tankX = leftPadding;
  const svgWidth = tankDisplayWidth + leftPadding + rightPadding;
  const svgHeight = tankDisplayHeight + topPadding;

  const ambientY = topPadding + tankDisplayHeight - ambientOilLevel * scale;
  let hotY = topPadding + tankDisplayHeight - hotOilLevel * scale;

  // Ensure at least 16px spacing between labels
  const minSpacing = 16;
  if (Math.abs(hotY - ambientY) < minSpacing) {
    if (hotY < ambientY) {
      hotY = ambientY - minSpacing;
    } else {
      hotY = ambientY + minSpacing;
    }
  }

  return (
    <section className="w-full h-full flex justify-center items-end px-4 pb-6 md:pb-8">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Gradient definitions */}
        <defs>
          <linearGradient id="ambientFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="hotFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F87171" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#DC2626" stopOpacity="0.25" />
          </linearGradient>
          {/* Clip path for oil fill */}
          <clipPath id="tankClip">
            <rect
              x={tankX}
              y={topPadding}
              width={tankDisplayWidth}
              height={tankDisplayHeight}
              rx="12"
              ry="12"
            />
          </clipPath>
        </defs>
        {/* Tank outline */}
        <rect
          x={tankX}
          y={topPadding}
          width={tankDisplayWidth}
          height={tankDisplayHeight}
          rx="12"
          ry="12"
          fill="#1f2937" // Tailwind slate-800
          stroke="#6b7280" // Tailwind gray-500
          strokeWidth="1.5"
        />
        {/* Ambient oil level (blue) */}
        <rect
          clipPath="url(#tankClip)"
          x={tankX}
          y={ambientY}
          width={tankDisplayWidth}
          height={svgHeight - ambientY}
          fill="url(#ambientFill)"
        />
        {/* Hot oil level (red) */}
        <rect
          clipPath="url(#tankClip)"
          x={tankX}
          y={hotY}
          width={tankDisplayWidth}
          height={ambientY - hotY}
          fill="url(#hotFill)"
        />

        {/* Ambient label and line */}
        <text
          x={tankX + tankDisplayWidth + 8}
          y={ambientY}
          fontSize="12"
          fill="#60a5fa"
          textAnchor="start"
          dominantBaseline="middle"
        >
          Ambient ({ambientTemp}°C)
        </text>
        <line
          x1={tankX + tankDisplayWidth}
          x2={tankX}
          y1={ambientY}
          y2={ambientY}
          stroke="#60a5fa"
          strokeWidth="1"
        />

        {/* Hot label and line */}
        <text
          x={tankX + tankDisplayWidth + 8}
          y={hotY}
          fontSize="12"
          fill="#f87171"
          textAnchor="start"
          dominantBaseline="middle"
        >
          Hot ({hotTemp}°C)
        </text>
        <line
          x1={tankX + tankDisplayWidth}
          x2={tankX}
          y1={hotY}
          y2={hotY}
          stroke="#f87171"
          strokeWidth="1"
        />
      </svg>
    </section>
  );
}
