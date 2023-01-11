import { useState } from "react";
import { useDropzone } from "react-dropzone";
import "./ImageDrop.css";
export const ImageDrop = ({
  setContextImage,
}: {
  setContextImage: React.Dispatch<React.SetStateAction<{}>>;
}) => {
  const [error, setError] = useState("");
  const onDrop = (files: File[]) => {
    console.log(":: ~ files", files);
    if (files.length > 1) {
      setError("Only one image allowed");
      return;
    }
    if (files.length === 0) {
      setError("No valid image found");
      return;
    }
    const file = files[0];
    console.log(":: ~ file", file);
    setContextImage({ file });
  };
  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
    },
    onDrop,
  });
  return (
    <div {...getRootProps()} className="image-drop">
      <input {...getInputProps()} />
      {isDragActive ? <>Drop it like it's hot</> : <>Drop an image here</>}
      {error && <div className="alert">{error}</div>}
    </div>
  );
};
