"use client";

import { useState } from "react";
import OilLevelVisualizer from "@/components/OilLevelVisualizer";
import { CardGlass } from "@/components/CardGlass";
import { useTheme } from "next-themes";

// --- Unit helpers -----------------------------------------------------------
function convertLengthToMeters(value: number, unit: "cm" | "in"): number {
  return unit === "in" ? value * 0.0254 : value / 100;
}
function convertVolumeToLiters(
  value: number,
  unit: "liters" | "gallons"
): number {
  return unit === "gallons" ? value * 3.78541 : value;
}
function convertHeightFromMeters(value: number, unit: "cm" | "in"): number {
  return unit === "in" ? value * 39.3701 : value * 100;
}

export default function OilExpansionPage() {
  // const { theme } = useTheme();

  // Form state ---------------------------------------------------------------
  const [volume, setVolume] = useState<number>(42);
  const [volumeUnit, setVolumeUnit] = useState<"liters" | "gallons">("gallons");
  const [lengthUnit, setLengthUnit] = useState<"cm" | "in">("in");

  const [tankShape, setTankShape] = useState<"rectangular" | "cylindrical">(
    "cylindrical"
  );
  const [length, setLength] = useState<number>(14);
  const [width, setWidth] = useState<number>(34);
  const [diameter, setDiameter] = useState<number>(20);

  const [ambientTemp, setAmbientTemp] = useState<number>(25);
  const [hotTemp, setHotTemp] = useState<number>(140);
  const [expansionCoeff, setExpansionCoeff] = useState<number>(0.00075);

  const [ambientOilLevel, setAmbientOilLevel] = useState<number>(26);
  const [tankHeight, setTankHeight] = useState<number>(30); // default 30 inches

  const [datumReference, setDatumReference] = useState<"bottom" | "top">(
    "bottom"
  );

  // -------------------------------------------------------------------------
  // Conversions & calcs
  // -------------------------------------------------------------------------
  const volumeLiters = convertVolumeToLiters(volume, volumeUnit);

  const crossSectionArea =
    tankShape === "cylindrical"
      ? Math.PI * Math.pow(convertLengthToMeters(diameter, lengthUnit) / 2, 2)
      : convertLengthToMeters(length, lengthUnit) *
        convertLengthToMeters(width, lengthUnit);

  const deltaTemp = hotTemp - ambientTemp;
  const expandedVolume = volumeLiters * (1 + expansionCoeff * deltaTemp);

  const tankHeightMeters = convertLengthToMeters(tankHeight, lengthUnit);

  const ambientOilLevelMeters =
    datumReference === "bottom"
      ? convertLengthToMeters(ambientOilLevel, lengthUnit)
      : tankHeightMeters - convertLengthToMeters(ambientOilLevel, lengthUnit);

  // Oil rise (m)
  const oilRise = (expandedVolume - volumeLiters) / 1000 / crossSectionArea;
  const hotOilLevelMeters = ambientOilLevelMeters + oilRise;

  // Display conversions
  const oilRiseDisplay = convertHeightFromMeters(oilRise, lengthUnit);
  // const hotOilLevelDisplay = convertHeightFromMeters(
  //   hotOilLevelMeters,
  //   lengthUnit
  // );
  const expandedVolumeDisplay =
    volumeUnit === "gallons" ? expandedVolume / 3.78541 : expandedVolume;

  // Shared input styles ------------------------------------------------------
  const inputClass =
    "w-full rounded px-3 py-2 border bg-[var(--field-bg)] border-[var(--field-border)] text-[var(--field-text)] placeholder-[var(--field-placeholder)] focus:outline-none focus:ring-2 focus:ring-blue-500";

  const labelClass = "block text-sm font-medium text-[var(--field-text)]";

  return (
    <main className="flex flex-col md:flex-row w-full gap-6 p-4 sm:p-6 md:p-8 max-w-full md:max-w-[1600px] mx-auto md:h-[calc(100vh-80px)] md:overflow-hidden overflow-auto">
      <div className="flex flex-col md:flex-row gap-8 items-stretch w-full">
        {/* LEFT: Form */}
        <div className="w-full md:w-1/2 flex justify-center md:py-8">
          <CardGlass className="space-y-6 w-full max-h-full overflow-auto px-4 py-6">
            {/* Volume */}
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-1">
                <label className={labelClass}>Volume</label>
                <input
                  type="number"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.target.value))}
                  className={inputClass}
                />
              </div>
              <div className="w-32 space-y-1">
                <label className={labelClass}>Unit</label>
                <select
                  value={volumeUnit}
                  onChange={(e) =>
                    setVolumeUnit(e.target.value as "liters" | "gallons")
                  }
                  className={inputClass}
                >
                  <option value="liters">Liters</option>
                  <option value="gallons">Gallons</option>
                </select>
              </div>
            </div>

            {/* Tank shape */}
            <div className="space-y-1">
              <label className={labelClass}>Tank shape</label>
              <select
                value={tankShape}
                onChange={(e) =>
                  setTankShape(e.target.value as "rectangular" | "cylindrical")
                }
                className={inputClass}
              >
                <option value="rectangular">Rectangular</option>
                <option value="cylindrical">Cylindrical</option>
              </select>
            </div>

            {/* Shape-dependent dims */}
            {tankShape === "rectangular" ? (
              <div className="space-y-4">
                <div className="flex gap-4 items-end">
                  <div className="flex-1 space-y-1">
                    <label className={labelClass}>Length</label>
                    <input
                      type="number"
                      value={length}
                      onChange={(e) => setLength(parseFloat(e.target.value))}
                      className={inputClass}
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className={labelClass}>Width</label>
                    <input
                      type="number"
                      value={width}
                      onChange={(e) => setWidth(parseFloat(e.target.value))}
                      className={inputClass}
                    />
                  </div>
                  <div className="w-32 space-y-1">
                    <label className={labelClass}>Unit</label>
                    <select
                      value={lengthUnit}
                      onChange={(e) =>
                        setLengthUnit(e.target.value as "cm" | "in")
                      }
                      className={inputClass}
                    >
                      <option value="cm">cm</option>
                      <option value="in">in</option>
                    </select>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex gap-4 items-end">
                <div className="flex-1 space-y-1">
                  <label className={labelClass}>Diameter</label>
                  <input
                    type="number"
                    value={diameter}
                    onChange={(e) => setDiameter(parseFloat(e.target.value))}
                    className={inputClass}
                  />
                </div>
                <div className="w-32 space-y-1">
                  <label className={labelClass}>Unit</label>
                  <select
                    value={lengthUnit}
                    onChange={(e) =>
                      setLengthUnit(e.target.value as "cm" | "in")
                    }
                    className={inputClass}
                  >
                    <option value="cm">cm</option>
                    <option value="in">in</option>
                  </select>
                </div>
              </div>
            )}

            {/* Temps */}
            <div className="space-y-1">
              <label className={labelClass}>Ambient Temperature (°C)</label>
              <input
                type="number"
                value={ambientTemp}
                onChange={(e) => setAmbientTemp(parseFloat(e.target.value))}
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <label className={labelClass}>Hot Temperature (°C)</label>
              <input
                type="number"
                value={hotTemp}
                onChange={(e) => setHotTemp(parseFloat(e.target.value))}
                className={inputClass}
              />
            </div>

            {/* Coefficient */}
            <div className="space-y-1">
              <label className={labelClass}>
                Thermal Expansion Coefficient (per °C)
              </label>
              <input
                type="number"
                step="0.00001"
                value={expansionCoeff}
                onChange={(e) => setExpansionCoeff(parseFloat(e.target.value))}
                className={inputClass}
              />
            </div>

            <hr className="my-4" />

            {/* Tank + ambient level inputs */}
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-1">
                <label className={labelClass}>Tank Height ({lengthUnit})</label>
                <input
                  type="number"
                  value={tankHeight}
                  onChange={(e) => setTankHeight(parseFloat(e.target.value))}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-1">
                <label className={labelClass}>Ambient Oil Level</label>
                <input
                  type="number"
                  value={ambientOilLevel}
                  onChange={(e) =>
                    setAmbientOilLevel(parseFloat(e.target.value))
                  }
                  className={inputClass}
                />
              </div>
              <div className="w-40 space-y-1">
                <label className={labelClass}>Datum</label>
                <select
                  value={datumReference}
                  onChange={(e) =>
                    setDatumReference(e.target.value as "bottom" | "top")
                  }
                  className={inputClass}
                >
                  <option value="bottom">From Bottom</option>
                  <option value="top">From Top</option>
                </select>
              </div>
            </div>
          </CardGlass>
        </div>

        {/* RIGHT: Results + Visualizer */}
        <div className="w-full md:w-1/2 flex flex-col flex-1">
          {/* Results section, vertically centered */}
          <section className="flex-1 flex flex-col justify-center text-foreground px-2 md:px-0 space-y-8">
            <h2 className="text-lg md:text-xl font-semibold tracking-wide uppercase text-[var(--text-muted)] text-left">
              Results
            </h2>

            <div className="flex flex-col gap-8 max-w-[700px] mx-auto w-full">
              {/* Expanded Volume */}
              <div className="flex flex-row items-center flex-wrap gap-x-3 justify-start">
                <span className="text-4xl md:text-5xl font-bold text-[var(--text-muted)]">
                  Expanded Volume:
                </span>
                <span className="text-4xl md:text-5xl font-bold text-[#f5c359] whitespace-nowrap">
                  {expandedVolumeDisplay.toFixed(2)}{" "}
                  {volumeUnit === "gallons" ? "gal" : "L"}
                </span>
              </div>

              {/* Oil Rise */}
              <div className="flex flex-row items-center flex-wrap gap-x-3 justify-start">
                <span className="text-4xl md:text-5xl font-bold text-[var(--text-muted)]">
                  Oil Rise:
                </span>
                <span className="text-4xl md:text-5xl font-bold text-[#f87171] whitespace-nowrap">
                  {oilRiseDisplay.toFixed(2)} {lengthUnit}
                </span>
              </div>
            </div>
          </section>

          {/* Visualizer aligned to bottom */}
          <div className="mt-6 md:flex-grow flex items-end overflow-hidden max-h-[50vh]">
            <OilLevelVisualizer
              ambientOilLevel={ambientOilLevelMeters}
              hotOilLevel={hotOilLevelMeters}
              ambientTemp={ambientTemp}
              hotTemp={hotTemp}
              tankHeightMeters={tankHeightMeters}
              tankWidthMeters={
                tankShape === "cylindrical"
                  ? convertLengthToMeters(diameter, lengthUnit)
                  : convertLengthToMeters(width, lengthUnit)
              }
            />
          </div>
        </div>
      </div>
    </main>
  );
}
