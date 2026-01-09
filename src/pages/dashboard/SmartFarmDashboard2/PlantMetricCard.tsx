import { useEffect, useState } from "react";

type PlantMetricCardProps = {
  position: "A" | "B" | "C" | "D" | "E" | "F";
  imageUrl: string;
   imageUrlx: string;
};

const PlantMetricCard: React.FC<PlantMetricCardProps> = ({
  position,
  imageUrl,
   imageUrlx,
}) => {
  // ✅ Hook ต้องอยู่ใน Component 
  const [areaA, setAreaA] = useState<number | null>(null);
  const [areaB, setAreaB] = useState<number | null>(null);
  const [areaC, setAreaC] = useState<number | null>(null);
  const [areaD, setAreaD] = useState<number | null>(null);
  const [areaE, setAreaE] = useState<number | null>(null);
  const [areaF, setAreaF] = useState<number | null>(null);
  const [heightA, setheightA] = useState<number | null>(null);
  const [heightB, setheightB] = useState<number | null>(null);
  const [heightC, setheightC] = useState<number | null>(null);
  const [heightD, setheightD] = useState<number | null>(null);
  const [heightE, setheightE] = useState<number | null>(null);
  const [heightF, setheightF] = useState<number | null>(null);

  const [lengthA, setlengthA] = useState<number | null>(null);
  const [lengthB, setlengthB] = useState<number | null>(null);
  const [lengthC, setlengthC] = useState<number | null>(null);
  const [lengthD, setlengthD] = useState<number | null>(null);
  const [lengthE, setlengthE] = useState<number | null>(null);
  const [lengthF, setlengthF] = useState<number | null>(null);
  const COLOR_MAP: Record<string, string> = {
    "Cool Yellow": "#e2c963ff",
    "Yellow Green": "#a6ea08e1",
    "Green": "#16a34a",
    "violet": "#7c3aed",
    "Red": "#dc2626",
  };
  const [colorA, setColorA] = useState<string>("");
  const [colorB, setColorB] = useState<string>("");
  const [colorC, setColorC] = useState<string>("");
  const [colorD, setColorD] = useState<string>("");
  const [colorE, setColorE] = useState<string>("");
  const [colorF, setColorF] = useState<string>("");
  useEffect(() => {
    const fetchAttributesImage = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/allRoutes/info/image_processing",
          { cache: "no-store" }
        );

        if (response.ok) {
          const data = await response.json();
          console.log("ℹ️ Init Attributes (API):", data);

          if (typeof data.area_A === "number") setAreaA(data.area_A);
          if (typeof data.area_B === "number") setAreaB(data.area_B);
          if (typeof data.area_C === "number") setAreaC(data.area_C);
          if (typeof data.area_D === "number") setAreaD(data.area_D);
          if (typeof data.area_E === "number") setAreaE(data.area_E);
          if (typeof data.area_F === "number") setAreaF(data.area_F);
          if (typeof data.height_A === "number") setheightA(data.height_A);
          if (typeof data.height_B === "number") setheightB(data.height_B);
          if (typeof data.height_C === "number") setheightC(data.height_C);
          if (typeof data.height_D === "number") setheightD(data.height_D);
          if (typeof data.height_E === "number") setheightE(data.height_E);
          if (typeof data.height_F === "number") setheightF(data.height_F);
          if (typeof data.length_A === "number") setlengthA(data.length_A);
          if (typeof data.length_B === "number") setlengthB(data.length_B);
          if (typeof data.length_C === "number") setlengthC(data.length_C);
          if (typeof data.length_D === "number") setlengthD(data.length_D);
          if (typeof data.length_E === "number") setlengthE(data.length_E);
          if (typeof data.length_F === "number") setlengthF(data.length_F);
          if (typeof data.color_A !== 'undefined') setColorA(data.color_A);
          if (typeof data.color_B !== 'undefined') setColorB(data.color_B);
          if (typeof data.color_C !== 'undefined') setColorC(data.color_C);
          if (typeof data.color_D !== 'undefined') setColorD(data.color_D);
          if (typeof data.color_E !== 'undefined') setColorE(data.color_E);
          if (typeof data.color_F !== 'undefined') setColorF(data.color_F);
        }
      } catch (error) {
        console.error("Fetch Info Error:", error);
      }
    };

    fetchAttributesImage();
  }, []);

  // ✅ เลือกค่าตาม Position
  const areaValue =
    position === "A" ? areaA : position === "B" ? areaB : position === "C" ? areaC : position === "D" ? areaD : position === "E" ? areaE : position === "F" ? areaF : null;
  const heightValue =
    position === "A" ? heightA : position === "B" ? heightB : position === "C" ? heightC : position === "D" ? heightD : position === "E" ? heightE : position === "F" ? heightF : null;
  const lengthValue =
    position === "A" ? lengthA : position === "B" ? lengthB : position === "C" ? lengthC : position === "D" ? lengthD : position === "E" ? lengthE : position === "F" ? lengthF : null;
    const colorByPosition: Record<string, string | undefined> = {
  A: colorA,
  B: colorB,
  C: colorC,
  D: colorD,
  E: colorE,
  F: colorF,
};


const colorValue = colorByPosition[position];

  return (
    <div className="plant-metric-card">
      <h3 className="plant-title">Position {position}</h3>

      {/* Image */}
      <div className="plant-image-small">
        <img src={imageUrl} alt={`Position ${position}`} />
        <img src={imageUrlx} alt={`Position ${position}`} />
      </div>

      {/* Metrics */}
      <div className="metrics-grid">
        <div className="metric-box">
          <span className="metric-label">Area : {areaValue !== null ? areaValue : "--"}</span>
          {/* <span className="metric-value">
            {areaValue !== null ? areaValue : "--"} <small>mm²</small>
          </span> */}
        </div>

        <div className="metric-box">
          <span className="metric-label">Height  : {heightValue !== null ? heightValue : "--"}</span>

        </div>

        <div className="metric-box">
          <span className="metric-label">Length : {lengthValue !== null ? lengthValue : "--"}</span>

        </div>

        <div className="metric-box">
          <span className="metric-label">Plant Status</span>
          <span className="metric-value status-normal">Normal</span>
        </div>

        <div className="metric-box">
          <span className="metric-label">Leaf Disease</span>
          <span className="metric-value">0</span>
        </div>
        <div className="metric-box">
          <div className="metric-left">

            <div>
              <span className="metric-label">Color {position}</span>

            </div>
          </div>

          <span
            className="color-dot"
            style={{ backgroundColor: COLOR_MAP[colorValue ?? ""] ?? "#9ca3af" }}
          />
          <span
            className="metric-value"
            style={{ color: COLOR_MAP[colorValue ?? ""] ?? "#374151" }}
          >
            {colorValue ?? "--"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default PlantMetricCard;
