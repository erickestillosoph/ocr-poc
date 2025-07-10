import { CameraAccessPageProps } from "./ui/camera-access-ui";
import { CameraAccessPageDify } from "./ui/camera-access-ui-dify";

export const CameraAccessDifyContainer = ({
  isHandleCameraOpen,
  isImageCapture,
}: CameraAccessPageProps) => {
  return (
    <CameraAccessPageDify
      isHandleCameraOpen={isHandleCameraOpen}
      isImageCapture={isImageCapture}
    />
  );
};
