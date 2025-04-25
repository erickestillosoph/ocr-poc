import { CameraAccessPage } from "./ui/camera-access-ui";
import { CameraAccessPageProps } from "./ui/camera-access-ui";

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
