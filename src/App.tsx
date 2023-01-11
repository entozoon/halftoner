import { ImageDrop } from "./ImageDrop";
import { createContext, useState } from "react";
import { Output } from "./Output";
import "./App.css";
export const ContextImage = createContext<null | File>(null);
const App = () => {
  const [contextImage, setContextImage] = useState<null | File>(null);
  return (
    <main className="App">
      <ContextImage.Provider value={contextImage}>
        <ImageDrop {...{ setContextImage }} />
        <Output />
      </ContextImage.Provider>
    </main>
  );
};
export default App;
