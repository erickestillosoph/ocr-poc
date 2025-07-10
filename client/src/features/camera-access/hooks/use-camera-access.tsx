import { useCallback, useRef, useState } from "react";
import Webcam from "react-webcam";
export const useCameraAccess = () => {
  const webcamRef = useRef<Webcam>(null);
  const [imageSrc, setImageSrc] = useState<string | null>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    console.log(imageSrc);
    if (imageSrc) {
      setImageSrc(imageSrc);
    }
  }, [webcamRef]);

  return { capture, webcamRef, imageSrc };
};
