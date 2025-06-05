type OilLevelVisualizerProps = {
  ambientOilLevel: number; // in meters
  hotOilLevel: number; // in meters
  ambientTemp: number; // In C
  hotTemp: number;
};

export default function OilLevelVisualizer({
  ambientOilLevel,
  hotOilLevel,
  ambientTemp,
  hotTemp,
}: OilLevelVisualizerProps) {
  const tankHeightMeters = 1.0; // assume max 1m visual tank
  const svgHeight = 200;
  const tankWidth = 100;

  const scale = svgHeight / tankHeightMeters;

  return (
    <svg viewBox={`0 0 120 ${svgHeight}`} className="w-full h-64">
      {/* Tank outline */}
      <rect
        x="30"
        y="0"
        width={tankWidth}
        height={svgHeight}
        fill="#e5e7eb"
        stroke="#9ca3af"
        strokeWidth="2"
      />

      {/* Ambient oil level (blue) */}
      <rect
        x="30"
        y={svgHeight - ambientOilLevel * scale}
        width={tankWidth}
        height={ambientOilLevel * scale}
        fill="blue"
        opacity="0.4"
      />

      {/* Hot oil level (red) */}
      <rect
        x="30"
        y={svgHeight - hotOilLevel * scale}
        width={tankWidth}
        height={(hotOilLevel - ambientOilLevel) * scale}
        fill="red"
        opacity="0.3"
      />

      {/* Labels */}
      <text
        x="10"
        y={
          Number.isFinite(ambientOilLevel * scale)
            ? svgHeight - ambientOilLevel * scale - 5
            : 0
        }
        fontSize="12"
        fill="#4B5563"
      >
        Ambient Oil Level ({ambientTemp} °C)
      </text>

      <text
        x="10"
        y={
          Number.isFinite(hotOilLevel * scale)
            ? svgHeight - hotOilLevel * scale - 5
            : 0
        }
        fontSize="12"
        fill="#DC2626"
      >
        Hot Oil Level ({hotTemp} °C)
      </text>
    </svg>
  );
}
