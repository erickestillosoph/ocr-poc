import { useState, useRef } from "react";

import heic2any from "heic2any";

export const convertHeicToJpeg = async (file: File) => {
  try {
    const blob = await heic2any({
      blob: file,
      toType: "image/jpeg",
      quality: 1,
    });

    // Converting blob to File
    const singleBlob = Array.isArray(blob) ? blob[0] : blob;
    return new File([singleBlob], file.name.replace(/\.heic$/i, ".jpeg"), {
      type: "image/jpeg",
    });
  } catch (err) {
    console.error("HEIC conversion failed:", err);
    alert(`Failed to convert HEIC image. ${err}`);

    return;
  }
};

export const useImageUploader = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultsFile, setResultsFile] = useState<File | null>(null);

  const [convertedImage, setConvertedImage] = useState<File>();

  const handleImageConversion = async (file: File) => {
    const isIphone =
      file.type === "image/heic" ||
      file.type === "image/heif" ||
      file.name.endsWith(".heic") ||
      file.name.endsWith(".heif");

    if (isIphone) {
      const converted = await convertHeicToJpeg(file);
      if (converted) {
        setConvertedImage(converted);
      }
    } else {
      setConvertedImage(file);
    }
  };

  const handleImageChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (!event.target.files || event.target.files.length === 0) return;
    const file = event.target.files[0];
    if (!file) return;

    const validImageTypes = [
      "image/jpeg",
      "image/png",
      "image/heic",
      "image/heif",
    ];
    if (!validImageTypes.includes(file.type)) {
      alert("Unsupported file type: " + file.type);
      return;
    }

    // Convert HEIC to JPEG if needed
    if (file.type === "image/heic" || file.type === "image/heif") {
      const converted = await convertHeicToJpeg(file);
      if (converted) {
        setPreviewUrl(URL.createObjectURL(converted));
        setResultsFile(converted);
      }
    } else {
      setPreviewUrl(URL.createObjectURL(file));
      setResultsFile(file);
    }
  };
  return {
    fileInputRef,
    previewUrl,
    handleImageChange,
    resultsFile,
    convertedImage,
    handleImageConversion,
  };
};
