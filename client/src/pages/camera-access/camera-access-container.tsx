import { CameraAccessPage, CameraAccessPageProps } from "./ui/camera-access-ui";

export const CameraAccessContainer = ({
  isHandleCameraOpen,
  isImageCapture,
}: CameraAccessPageProps) => {
  return (
    <CameraAccessPage
      isHandleCameraOpen={isHandleCameraOpen}
      isImageCapture={isImageCapture}
    />
  );
};
