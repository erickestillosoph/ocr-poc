import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";

export const useCameraAccess = () => {
  const webcamRef = useRef<Webcam>(null);
  const [base64ToImageFile, setBase64ToImageFile] = useState<File | null>(null);
  const base64ToFileArray = useCallback((base64: string) => {
    const arr = base64.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] || "image/png";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    const file = new File([u8arr], `screenshot-${Date.now()}.png`, {
      type: mime,
    });
    setBase64ToImageFile(file);
  }, []);
  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      base64ToFileArray(imageSrc);
    }
  }, [webcamRef, base64ToFileArray]);

  return { capture, webcamRef, base64ToImageFile };
};
