import { ImageDrop } from "./ImageDrop";
import "./App.css";
import { createContext, useState } from "react";
import { Output } from "./Output";
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
