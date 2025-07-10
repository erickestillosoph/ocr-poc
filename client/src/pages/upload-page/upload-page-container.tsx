import { CameraAccessContainer } from "@/features/camera-access";
import { UploadFileContainer } from "@/features/upload-file";
import { PageWrapper } from "@/shared/ui/page-wrapper/page-wrapper";
import { useState } from "react";

export const UploadPageContainer = () => {
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  const onHandleCameraOpen = (isCameraOpen: boolean) => {
    setIsCameraOpen(isCameraOpen);
  };

  return (
    <PageWrapper>
      <CameraAccessContainer isHandleCameraOpen={onHandleCameraOpen} />
      {!isCameraOpen && <UploadFileContainer />}
    </PageWrapper>
  );
};
