"use client";
import { useEffect, useState } from "react";

type OilLevelVisualizerProps = {
  ambientOilLevel: number;
  hotOilLevel: number;
  ambientTemp: number;
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const topPadding = 40;
  const bottomPadding = 20;
  const tankDisplayHeight = 400;
  const scale = tankDisplayHeight / tankHeightMeters;
  const tankDisplayWidth = tankWidthMeters * scale;
  const leftPadding = 100;
  const rightPadding = 100;
  const tankX = leftPadding;
  const svgWidth = tankDisplayWidth + leftPadding + rightPadding;
  const svgHeight = tankDisplayHeight + topPadding + bottomPadding;

  // 🎨 Dark-mode first color palette
  const tankFill = "transparent"; // background shows through
  const tankStroke = "#94a3b8"; // slate-400
  const ambientLabel = "#60a5fa"; // blue-400
  const hotLabel = "#f87171"; // red-400

  const ambientY = topPadding + tankDisplayHeight - ambientOilLevel * scale;
  let hotY = topPadding + tankDisplayHeight - hotOilLevel * scale;

  const minSpacing = 16;
  if (Math.abs(hotY - ambientY) < minSpacing) {
    hotY = hotY < ambientY ? ambientY - minSpacing : ambientY + minSpacing;
  }

  return (
    <section className="w-full h-full flex justify-center items-end px-4 pb-6 md:pb-8">
      <svg
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        className="w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="ambientFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#3B82F6" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#3B82F6" stopOpacity="0.25" />
          </linearGradient>

          <linearGradient id="hotFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#F87171" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#FCA5A5" stopOpacity="0.25" />
          </linearGradient>

          <clipPath id="tankClip">
            <rect
              x={tankX}
              y={topPadding}
              width={tankDisplayWidth}
              height={tankDisplayHeight + 2}
              rx="12"
              ry="12"
            />
          </clipPath>
        </defs>

        {/* Tank */}
        <rect
          x={tankX}
          y={topPadding}
          width={tankDisplayWidth}
          height={tankDisplayHeight}
          rx="12"
          ry="12"
          fill={tankFill}
          stroke={tankStroke}
          strokeWidth="1.5"
        />

        {/* Ambient fill */}
        <rect
          clipPath="url(#tankClip)"
          x={tankX}
          y={ambientY}
          width={tankDisplayWidth}
          height={svgHeight - ambientY}
          fill="url(#ambientFill)"
        />

        {/* Hot fill */}
        <rect
          clipPath="url(#tankClip)"
          x={tankX}
          y={hotY}
          width={tankDisplayWidth}
          height={ambientY - hotY}
          fill="url(#hotFill)"
        />

        {/* Labels */}
        <text
          x={tankX + tankDisplayWidth + 8}
          y={ambientY}
          fontSize="12"
          fill={ambientLabel}
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
          stroke={ambientLabel}
          strokeWidth="1"
        />
        <text
          x={tankX + tankDisplayWidth + 8}
          y={hotY}
          fontSize="12"
          fill={hotLabel}
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
          stroke={hotLabel}
          strokeWidth="1"
        />
      </svg>
    </section>
  );
}
