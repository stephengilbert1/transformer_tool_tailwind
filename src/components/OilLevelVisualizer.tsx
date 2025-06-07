type OilLevelVisualizerProps = {
  ambientOilLevel: number; // in meters
  hotOilLevel: number; // in meters
  ambientTemp: number; // In C
  hotTemp: number;
  tankHeightMeters: number;
};

export default function OilLevelVisualizer({
  ambientOilLevel,
  hotOilLevel,
  ambientTemp,
  hotTemp,
  tankHeightMeters,
}: OilLevelVisualizerProps) {
  const topPadding = 40; // extra space for labels (in pixels)
  const tankDisplayHeight = 200; // visual height in pixels
  const tankWidth = 100;

  const scale = tankDisplayHeight / tankHeightMeters;
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
    <svg viewBox={`0 0 120 ${svgHeight}`} className="w-full h-64">
      {/* Tank outline */}
      <rect
        x="30"
        y={topPadding}
        width={tankWidth}
        height={tankDisplayHeight}
        fill="#e5e7eb"
        stroke="#9ca3af"
        strokeWidth="2"
      />

      {/* Ambient oil level (blue) */}
      <rect
        x="30"
        y={ambientY}
        width={tankWidth}
        height={svgHeight - ambientY}
        fill="blue"
        opacity="0.4"
      />

      {/* Hot oil level (red) */}
      <rect
        x="30"
        y={hotY}
        width={tankWidth}
        height={ambientY - hotY}
        fill="red"
        opacity="0.3"
      />

      {/* Ambient label and line */}
      <text x="-100" y={ambientY - 2} fontSize="12" fill="#3B82F6">
        Ambient ({ambientTemp}°C)
      </text>
      <line
        x1="-100"
        x2="30"
        y1={ambientY}
        y2={ambientY}
        stroke="#3B82F6"
        strokeWidth="1"
      />

      {/* Hot label and line */}
      <text x="-100" y={hotY - 2} fontSize="12" fill="#DC2626">
        Hot ({hotTemp}°C)
      </text>
      <line
        x1="-100"
        x2="30"
        y1={hotY}
        y2={hotY}
        stroke="#DC2626"
        strokeWidth="1"
      />
    </svg>
  );
}
