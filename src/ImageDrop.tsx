import { useState } from "react";
import { useDropzone } from "react-dropzone";
import "./ImageDrop.css";
export const ImageDrop = ({
  setContextImage,
}: {
  setContextImage: React.Dispatch<React.SetStateAction<null | File>>;
}) => {
  const [error, setError] = useState("");
  const onDrop = (files: File[]) => {
    setError("");
    if (files.length > 1) {
      setError("Only one image allowed");
      return setContextImage(null);
    }
    if (files.length === 0) {
      setError("No valid image found");
      return setContextImage(null);
    }
    const file = files[0];
    return setContextImage(file);
  };
  const { getInputProps, getRootProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [],
      "image/png": [],
      "image/webp": [],
      "image/bmp": [],
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
