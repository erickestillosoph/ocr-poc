import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";

export const useCameraAccess = () => {
  const webcamRef = useRef<Webcam>(null);

  const [imageSrcInBase64, setImageSrcInBase64] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();

    if (imageSrc) {
      setImageSrcInBase64(imageSrc);
    }
  }, [webcamRef]);

  return { capture, webcamRef, imageSrcInBase64 };
};
