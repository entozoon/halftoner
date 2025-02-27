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
  const [loading, setLoading] = useState(true);
  return (
    <main className="App">
      <ContextImage.Provider value={contextImage}>
        <ContextControls.Provider value={contextControls}>
          <aside>
            <h1>Halftoner</h1>
            <ImageDrop {...{ setContextImage }} />
            <Controls {...{ setContextControls, loading, setLoading }} />
            <footer>
              &copy;{" "}
              <a href="https://www.michaelcook.tech/">MichaelCook.tech</a>
            </footer>
          </aside>
          <Output {...{ setLoading }} />
        </ContextControls.Provider>
      </ContextImage.Provider>
    </main>
  );
};
export default App;
