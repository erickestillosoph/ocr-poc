import { useCallback, useRef } from "react";
import Webcam from "react-webcam";
export const useCameraAccess = () => {
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    console.log(imageSrc);
  }, [webcamRef]);

  return { capture, webcamRef };
};
