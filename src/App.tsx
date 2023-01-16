import { ImageDrop } from "./ImageDrop";
import { createContext, useState } from "react";
import { Output } from "./Output";
import "./App.scss";
import { ControlDefaults, Controls, ControlsValues } from "./Controls";
export const ContextImage = createContext<null | File>(null);
export const ContextControls = createContext<null | ControlsValues>(null);
const App = () => {
  const [contextImage, setContextImage] = useState<null | File>(null);
  const [contextControls, setContextControls] = useState<null | ControlsValues>(
    ControlDefaults
  );
  return (
    <main className="App">
      <ContextImage.Provider value={contextImage}>
        <ContextControls.Provider value={contextControls}>
          <aside>
            <ImageDrop {...{ setContextImage }} />
            <Controls {...{ setContextControls }} />
            &copy; <a href="https://www.michaelcook.tech/">MichaelCook.tech</a>
          </aside>
          <Output />
        </ContextControls.Provider>
      </ContextImage.Provider>
    </main>
  );
};
export default App;
