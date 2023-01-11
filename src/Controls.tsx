import { useState } from "react";
import "./Controls.scss";
export interface ControlsValues {
  maxRadius: number;
  spacing: number;
}
export const ControlDefaults = {
  maxRadius: 12,
  spacing: 1.5,
};
export const Controls = ({
  setContextControls,
}: {
  setContextControls: React.Dispatch<React.SetStateAction<any>>;
}) => {
  const [values, setValues] = useState(ControlDefaults);
  const [debounce, setDebounce] = useState<NodeJS.Timeout | null>(null);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setValues({ ...values, [name]: parseFloat(value) });
    // Smallest debounce just to force the stack
    if (debounce) clearTimeout(debounce);
    setDebounce(
      setTimeout(() => {
        setContextControls(values);
        console.log("d");
      }, 5)
    );
  };
  return (
    <form className="controls">
      <section>
        <div>
          <label htmlFor="maxRadius">Max Radius</label>
          <output>{values.maxRadius}</output>
        </div>
        <input
          type="range"
          id="maxRadius"
          name="maxRadius"
          min="1"
          max="100"
          step="0.1"
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
          max="100"
          step="0.1"
          value={values.spacing}
          onChange={handleChange}
        />
      </section>
    </form>
  );
};
