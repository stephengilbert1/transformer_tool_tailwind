"use client";
import { useState } from "react";
import OilLevelVisualizer from "@/components/OilLevelVisualizer";

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

export default function Home() {
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

  // Conversion
  const volumeLiters = convertVolumeToLiters(volume, volumeUnit);

  const crossSectionArea =
    tankShape === "cylindrical"
      ? Math.PI * Math.pow(convertLengthToMeters(diameter, lengthUnit) / 2, 2)
      : convertLengthToMeters(length, lengthUnit) *
        convertLengthToMeters(width, lengthUnit);

  // Expansion
  const deltaTemp = hotTemp - ambientTemp;
  const expandedVolume = volumeLiters * (1 + expansionCoeff * deltaTemp);

  // Heights
  const tankHeightMeters = convertLengthToMeters(tankHeight, lengthUnit);

  const ambientOilLevelMeters =
    datumReference === "bottom"
      ? convertLengthToMeters(ambientOilLevel, lengthUnit)
      : tankHeightMeters - convertLengthToMeters(ambientOilLevel, lengthUnit);

  // Calculate the oil *rise* due to expansion
  const oilRise = (expandedVolume - volumeLiters) / 1000 / crossSectionArea;

  // Total hot level is user’s ambient input + calculated rise
  const hotOilLevelMeters = ambientOilLevelMeters + oilRise;

  // Convert for output
  const oilRiseDisplay = convertHeightFromMeters(oilRise, lengthUnit);
  const hotOilLevelDisplay = convertHeightFromMeters(
    hotOilLevelMeters,
    lengthUnit
  );
  const expandedVolumeDisplay =
    volumeUnit === "gallons" ? expandedVolume / 3.78541 : expandedVolume;

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-xl mx-auto bg-white shadow-md rounded-lg p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          Transformer Oil Expansion Tool
        </h1>
        <p className="text-gray-600 text-center">
          Estimate oil rise based on volume, temperature, and tank shape.
        </p>

        <div className="flex gap-4 items-end">
          <div className="flex-1 space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Volume
            </label>
            <input
              type="number"
              value={volume}
              onChange={(e) => setVolume(parseFloat(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="w-32 space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Unit
            </label>
            <select
              value={volumeUnit}
              onChange={(e) =>
                setVolumeUnit(e.target.value as "liters" | "gallons")
              }
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="liters">Liters</option>
              <option value="gallons">Gallons</option>
            </select>
          </div>
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Tank shape
          </label>
          <select
            value={tankShape}
            onChange={(e) =>
              setTankShape(e.target.value as "rectangular" | "cylindrical")
            }
            className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="rectangular">Rectangular</option>
            <option value="cylindrical">Cylindrical</option>
          </select>
        </div>

        {tankShape === "rectangular" ? (
          <>
            <div className="flex gap-4 items-end">
              <div className="flex-1 space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Length
                </label>
                <input
                  type="number"
                  value={length}
                  onChange={(e) => setLength(parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex-1 space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Width
                </label>
                <input
                  type="number"
                  value={width}
                  onChange={(e) => setWidth(parseFloat(e.target.value))}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="w-32 space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Unit
                </label>
                <select
                  value={lengthUnit}
                  onChange={(e) => setLengthUnit(e.target.value as "cm" | "in")}
                  className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="cm">cm</option>
                  <option value="in">in</option>
                </select>
              </div>
            </div>
          </>
        ) : (
          <div className="flex gap-4 items-end">
            <div className="flex-1 space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Diameter
              </label>
              <input
                type="number"
                value={diameter}
                onChange={(e) => setDiameter(parseFloat(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="w-32 space-y-1">
              <label className="block text-sm font-medium text-gray-700">
                Unit
              </label>
              <select
                value={lengthUnit}
                onChange={(e) => setLengthUnit(e.target.value as "cm" | "in")}
                className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="cm">cm</option>
                <option value="in">in</option>
              </select>
            </div>
          </div>
        )}

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Ambient Temperature (°C)
          </label>
          <input
            type="number"
            value={ambientTemp}
            onChange={(e) => setAmbientTemp(parseFloat(e.target.value))}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Hot Temperature (°C)
          </label>
          <input
            type="number"
            value={hotTemp}
            onChange={(e) => setHotTemp(parseFloat(e.target.value))}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="space-y-1">
          <label className="block text-sm font-medium text-gray-700">
            Thermal Expansion Coefficient (°C)
          </label>
          <input
            type="number"
            step="0.00001"
            value={expansionCoeff}
            onChange={(e) => setExpansionCoeff(parseFloat(e.target.value))}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <hr className="my-6" />
        <h2 className="text-lg font-semibold text-gray-700">Results</h2>
        <div className="space-y-1 text-gray-800">
          <p>
            Expanded oil volume:{" "}
            <strong>
              {expandedVolumeDisplay.toFixed(2)} {volumeUnit}
            </strong>
          </p>
          <p>
            Oil rise:{" "}
            <strong>
              {oilRiseDisplay.toFixed(2)} {lengthUnit}
            </strong>
          </p>
        </div>
        <div className="flex gap-4 items-end">
          <div className="flex-1 space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Tank Height ({lengthUnit})
            </label>
            <input
              type="number"
              value={tankHeight}
              onChange={(e) => setTankHeight(parseFloat(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-4 items-end">
          {/* Ambient Oil Level Input */}
          <div className="flex-1 space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Ambient Oil Level
            </label>
            <input
              type="number"
              value={ambientOilLevel}
              onChange={(e) => setAmbientOilLevel(parseFloat(e.target.value))}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Datum Dropdown */}
          <div className="w-40 space-y-1">
            <label className="block text-sm font-medium text-gray-700">
              Datum
            </label>
            <select
              value={datumReference}
              onChange={(e) =>
                setDatumReference(e.target.value as "bottom" | "top")
              }
              className="w-full border border-gray-300 rounded px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="bottom">From Bottom</option>
              <option value="top">From Top</option>
            </select>
          </div>
        </div>

        <p>
          140°C oil level:{" "}
          <strong>
            {hotOilLevelDisplay.toFixed(2)} {lengthUnit}
          </strong>
        </p>
        {!isNaN(hotOilLevelMeters) &&
          !isNaN(ambientOilLevelMeters) &&
          isFinite(hotOilLevelMeters) &&
          isFinite(ambientOilLevelMeters) && (
            <OilLevelVisualizer
              ambientOilLevel={ambientOilLevelMeters}
              hotOilLevel={hotOilLevelMeters}
              ambientTemp={ambientTemp}
              hotTemp={hotTemp}
              tankHeightMeters={tankHeightMeters}
            />
          )}
      </div>
    </main>
  );
}
