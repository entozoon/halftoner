import { useState } from "react";
import "./Controls.scss";
import { parseToGivenType } from "./utils";
export interface ControlsValues {
  example: number;
  maxRadius: number;
  spacingX: number;
  spacingY: number;
  vOffset: number;
  colorMode: string;
  paletteSize: number;
  contrast: number;
  brightness: number;
}
export enum ColorModes {
  rgb = "RGB",
  greyScale = "Greyscale",
  monochromish = "Monochromish",
  sepia = "Sepia",
  inverted = "Inverted",
  perfectAscii = "Perfect ASCII",
}
export let ControlDefaults = {
  example: 0,
  maxRadius: 15,
  spacingX: 1.5,
  spacingY: 1.5,
  vOffset: 1,
  colorMode: ColorModes.rgb,
  paletteSize: 8,
  contrast: 1,
  brightness: 0,
};
export const Examples = [
  {
    ...ControlDefaults,
    image: "example1.jpg",
    maxRadius: 14,
    spacingX: 1.7,
    spacingY: 1.7,
    vOffset: 1,
    colorMode: ColorModes.rgb,
    paletteSize: 3, // 5
    contrast: 1.9,
    brightness: -43,
  },
  {
    ...ControlDefaults,
    image: "example2.jpg",
    maxRadius: 10,
    spacingX: 1.6,
    spacingY: 1.6,
    vOffset: 0.3,
    colorMode: ColorModes.sepia,
    paletteSize: 3, // 5
    contrast: 2.6,
    brightness: -17,
  },
  {
    ...ControlDefaults,
    image: "example3.jpg",
    maxRadius: 7,
    spacingX: 1.5,
    spacingY: 1.5,
    vOffset: 0,
    colorMode: ColorModes.rgb,
    paletteSize: 11, // inf
    contrast: 7.4,
    brightness: -43,
  },
  {
    ...ControlDefaults,
    image: "example4.jpg",
    maxRadius: 19,
    spacingX: 1.3,
    spacingY: 1.3,
    vOffset: 0.6,
    colorMode: ColorModes.rgb,
    paletteSize: 10, // 12
    contrast: 2.3,
    brightness: -25,
  },
  {
    ...ControlDefaults,
    image: "example5.png",
    maxRadius: 1,
    spacingX: 1,
    spacingY: 1,
    vOffset: 0,
    colorMode: ColorModes.perfectAscii,
    paletteSize: 12, // 12
    contrast: 1,
    brightness: 0,
  },
];
// ControlDefaults.example = Math.floor(Math.random() * Examples.length); // buggy
export const Controls = ({
  setContextControls,
  loading,
  setLoading,
}: {
  setContextControls: React.Dispatch<React.SetStateAction<any>>;
  loading: boolean;
  setLoading: any;
}) => {
  const exampleDefault = Examples[ControlDefaults.example];
  const [values, setValues] = useState(exampleDefault);
  const [debounce, setDebounce] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLoading(true);
    const { name, value } = e.target;
    let _values;
    if (name === "example") {
      _values = Examples[Number(value)];
      _values = {
        ...Examples[Number(value)],
        [name]: value,
      };
    } else {
      _values = {
        ...values,
        [name]: parseToGivenType(
          value,
          typeof ControlDefaults[name as keyof ControlsValues]
        ),
      };
    }
    // console.log(":: ~ _values", _values);
    setValues(_values);
    // Smallest debounce just to force the stack
    if (debounce) clearTimeout(debounce);
    setDebounce(
      setTimeout(() => {
        setContextControls(_values);
      }, 5)
    );
  };
  return (
    <>
      {loading && <div className="loading">Processing...</div>}
      <section className="example-images">
        <label>Examples</label>
        <fieldset>
          {Examples.map((e, i) => (
            <div key={i}>
              <input
                type="radio"
                name="example"
                id={`example-${i}`}
                value={i}
                onChange={handleChange}
                checked={`${values.example}` === `${i}`}
              />
              <label htmlFor={`example-${i}`}>{i + 1}</label>
            </div>
          ))}
        </fieldset>
      </section>
      <form className="controls">
        <section>
          <button
            type="button"
            onClick={() => {
              setValues(exampleDefault);
              setContextControls(exampleDefault);
            }}
          >
            <span>↺</span>
            Reset
          </button>
        </section>
        <section>
          <div>
            <label htmlFor="maxRadius">
              <span>◯</span> Max Radius
            </label>
            <output>{values.maxRadius}</output>
          </div>
          <input
            type="range"
            id="maxRadius"
            name="maxRadius"
            min="2"
            max="50"
            step="1"
            value={values.maxRadius}
            onChange={handleChange}
          />
        </section>
        <section>
          <div>
            <label htmlFor="spacing">
              <span>↔</span> Spacing X
            </label>
            <output>{values.spacingX}</output>
          </div>
          <input
            type="range"
            id="spacingX"
            name="spacingX"
            min="1"
            max="3"
            step="0.1"
            value={values.spacingX}
            onChange={handleChange}
          />
        </section>
        <section>
          <div>
            <label htmlFor="spacing">
              <span>↕</span> Spacing Y
            </label>
            <output>{values.spacingY}</output>
          </div>
          <input
            type="range"
            id="spacingY"
            name="spacingY"
            min="1"
            max="3"
            step="0.1"
            value={values.spacingY}
            onChange={handleChange}
          />
        </section>
        <section>
          <div>
            <label htmlFor="vOffset">
              <span>↕</span> Vertical Offset
            </label>
            <output>{values.vOffset}</output>
          </div>
          <input
            type="range"
            id="vOffset"
            name="vOffset"
            min="0"
            max="1"
            step="0.1"
            value={values.vOffset}
            onChange={handleChange}
          />
        </section>
        <section>
          <label>Color Modes</label>
          <fieldset>
            {Object.values(ColorModes).map((mode) => (
              <div key={mode} className={`input-${mode.toLowerCase()}`}>
                <input
                  type="radio"
                  name="colorMode"
                  id={`colorMode${mode}`}
                  value={mode}
                  onChange={handleChange}
                  checked={values.colorMode === mode}
                />
                <label htmlFor={`colorMode${mode}`}>{mode}</label>
              </div>
            ))}
          </fieldset>
        </section>
        <section>
          <div>
            <label htmlFor="paletteSize">
              <span>🎨</span> Colour Palette Size
            </label>
            <output>
              {values.paletteSize === 1
                ? "B/W"
                : values.paletteSize > 10
                ? "∞"
                : values.paletteSize + 3}
            </output>
          </div>
          <input
            type="range"
            id="paletteSize"
            name="paletteSize"
            min="1"
            max="11"
            step="1"
            value={values.paletteSize}
            onChange={handleChange}
          />
        </section>
        <section>
          <div>
            <label htmlFor="contrast">
              <span>◑</span> Contrast
            </label>
            <output>{values.contrast}</output>
          </div>
          <input
            type="range"
            id="contrast"
            name="contrast"
            min="0"
            max="10"
            step=".1"
            value={values.contrast}
            onChange={handleChange}
          />
        </section>
        <section>
          <div>
            <label htmlFor="brightness">
              <span>🔆</span> Brightness
            </label>
            <output>{values.brightness}</output>
          </div>
          <input
            type="range"
            id="brightness"
            name="brightness"
            min="-100"
            max="100"
            step="1"
            value={values.brightness}
            onChange={handleChange}
          />
        </section>
      </form>
    </>
  );
};
