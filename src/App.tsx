import { ImageDrop } from "./ImageDrop";
import "./App.css";
import { createContext, useState } from "react";
export const ContextImage = createContext({});
const App = () => {
  const [contextImage, setContextImage] = useState({});
  return (
    <main className="App">
      <ContextImage.Provider value={contextImage}>
        <ImageDrop {...{ setContextImage }} />
        {/* const contextImage = useContext(ContextImage); */}
      </ContextImage.Provider>
    </main>
  );
};
export default App;
