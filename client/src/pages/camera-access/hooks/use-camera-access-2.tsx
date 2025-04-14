import { setLocalStorage } from "@/shared";
import { useCallback, useRef } from "react";
import Webcam from "react-webcam";
export const useCameraAccess = () => {
  const webcamRef = useRef<Webcam>(null);

  const capture = useCallback(() => {
    const imageSrc = webcamRef.current?.getScreenshot();
    console.log(imageSrc);
    setLocalStorage("imageResults", imageSrc);

  }, [webcamRef]);

  return { capture, webcamRef };
};
