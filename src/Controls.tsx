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
  contrast: number;
  brightness: number;
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
  contrast: 1,
  brightness: 0,
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
          <label htmlFor="maxRadius">
            <span>◯</span> Max Radius
          </label>
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
          <label htmlFor="spacing">
            <span>↔</span> Spacing
          </label>
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
            <span>🎨</span> Palette Size
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
          step="10"
          value={values.brightness}
          onChange={handleChange}
        />
      </section>
    </form>
  );
};
