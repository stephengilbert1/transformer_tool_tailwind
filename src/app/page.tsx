"use client";

import { useState } from "react";
import OilLevelVisualizer from "@/components/OilLevelVisualizer";

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
  const hotOilLevelDisplay = convertHeightFromMeters(
    hotOilLevelMeters,
    lengthUnit
  );
  const expandedVolumeDisplay =
    volumeUnit === "gallons" ? expandedVolume / 3.78541 : expandedVolume;

  // Shared input styles ------------------------------------------------------
  const inputClass =
    "w-full rounded px-3 py-2 border bg-[var(--field-bg)] border-[var(--field-border)] text-[var(--field-text)] placeholder-[var(--field-placeholder)] focus:outline-none focus:ring-2 focus:ring-blue-500";

  const labelClass = "block text-sm font-medium text-[var(--field-text)]";

  return (
    <main className="min-h-screen bg-[var(--background)] py-10 px-4">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="space-y-2 text-center">
          <h1 className="text-2xl font-bold text-[var(--text-primary)]">
            Transformer Oil Expansion Tool
          </h1>
          <p className="text-[var(--text-muted)]">
            Estimate oil rise based on volume, temperature, and tank shape.
          </p>
        </header>

        {/* Responsive 2-col layout ------------------------------------------------ */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* --------------------------------------------------------------------- */}
          {/* LEFT: Input Form                                                     */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-[var(--surface)] rounded-xl shadow-md p-6 space-y-6">
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
          </div>

          {/* --------------------------------------------------------------------- */}
          {/* RIGHT: Results + Visualization                                       */}
          {/* --------------------------------------------------------------------- */}
          <div className="bg-[var(--surface)] rounded-xl shadow-md p-6 space-y-6">
            <section className="space-y-2">
              <h2 className="text-lg font-semibold text-[var(--text-primary)]">
                Results
              </h2>
              <p className="text-[var(--text-secondary)]">
                Expanded oil volume:{" "}
                <strong>
                  {expandedVolumeDisplay.toFixed(2)} {volumeUnit}
                </strong>
              </p>
              <p className="text-[var(--text-secondary)]">
                Oil rise:{" "}
                <strong>
                  {oilRiseDisplay.toFixed(2)} {lengthUnit}
                </strong>
              </p>
              <p className="text-[var(--text-secondary)]">
                140°C oil level:{" "}
                <strong>
                  {hotOilLevelDisplay.toFixed(2)} {lengthUnit}
                </strong>
              </p>
            </section>

            {/* Visualization */}
            {!isNaN(hotOilLevelMeters) &&
              !isNaN(ambientOilLevelMeters) &&
              isFinite(hotOilLevelMeters) &&
              isFinite(ambientOilLevelMeters) && (
                <div className="mt-4">
                  <OilLevelVisualizer
                    ambientOilLevel={ambientOilLevelMeters}
                    hotOilLevel={hotOilLevelMeters}
                    ambientTemp={ambientTemp}
                    hotTemp={hotTemp}
                    tankHeightMeters={tankHeightMeters}
                  />
                </div>
              )}
          </div>
        </div>
      </div>
    </main>
  );
}
