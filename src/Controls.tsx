import { useState } from "react";
import "./Controls.scss";
import { parseToGivenType } from "./utils";
export interface ControlsValues {
  example: string;
  maxRadius: number;
  spacing: number;
  vOffset: number;
  colorMode: string;
  paletteSize: number;
}
export enum ColorModes {
  rgb = "RGB",
  greyScale = "Greyscale",
  sepia = "Sepia",
  inverted = "Inverted",
}
export const ControlDefaults = {
  example: "example1.jpg",
  maxRadius: 15,
  spacing: 1.5,
  vOffset: 1,
  colorMode: ColorModes.rgb,
  paletteSize: 8,
};
export const Controls = ({
  setContextControls,
}: {
  setContextControls: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [values, setValues] = useState(ControlDefaults);
  const [debounce, setDebounce] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const _values = {
      ...values,
      [name]: parseToGivenType(
        value,
        typeof ControlDefaults[name as keyof ControlsValues]
      ),
    };
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
    <form className="controls">
      <section>
        <label>Example Images</label>
        <fieldset>
          {[1, 2, 3, 4].map((i) => (
            <div key={i}>
              <input
                type="radio"
                name="example"
                id={`example${i}`}
                value={`example${i}.jpg`}
                onChange={handleChange}
                checked={values.example === `example${i}.jpg`}
              />
              <label htmlFor={`example${i}`}>{i}</label>
            </div>
          ))}
        </fieldset>
      </section>
      <section>
        <div>
          <label htmlFor="maxRadius">Max Radius</label>
          <output>{values.maxRadius}</output>
        </div>
        <input
          type="range"
          id="maxRadius"
          name="maxRadius"
          min="7"
          max="100"
          step="1"
          value={values.maxRadius}
          onChange={handleChange}
        />
      </section>
      <section>
        <div>
          <label htmlFor="spacing">Spacing</label>
          <output>{values.spacing}</output>
        </div>
        <input
          type="range"
          id="spacing"
          name="spacing"
          min="1"
          max="3"
          step="0.1"
          value={values.spacing}
          onChange={handleChange}
        />
      </section>
      <section>
        <div>
          <label htmlFor="vOffset">Vertical Offset</label>
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
        <label>Colour Modes</label>
        <fieldset>
          {Object.values(ColorModes).map((mode) => (
            <div key={mode}>
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
          <label htmlFor="paletteSize">Palette Size</label>
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
    </form>
  );
};
