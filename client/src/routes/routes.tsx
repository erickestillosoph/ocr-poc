import { Outlet, RouteObject } from "react-router-dom";

import {
  NotFoundPageContainer,
  UploadCameraContainer,
  UploadCameraDifyContainer,
  UploadPageContainer,
  ViewResultsPageContainer,
} from "@/pages";
import { NotFoundGuard } from "./not-found-guard";
import { paths } from "@/shared";
import { FileUploadContainer } from "@/components/upload-file/file-upload-container";

export const routes: RouteObject[] = [
  {
    children: [
      {
        element: <Outlet />,
        children: [
          {
            element: <UploadCameraDifyContainer />,
            path: "/",
          },
          {
            element: <UploadCameraContainer />,
            path: paths.read,
          },
          {
            element: <UploadPageContainer />,
            path: paths.uploadPage,
          },
          {
            element: <UploadCameraDifyContainer />,
            path: paths.cameraAccessUploadFileDify,
          },
          {
            element: <ViewResultsPageContainer />,
            path: paths.myPage,
          },
          {
            element: <FileUploadContainer />,
            path: paths.oldUiUpload,
          },
        ],
      },
      {
        element: (
          <NotFoundGuard>
            <Outlet />
          </NotFoundGuard>
        ),
        children: [
          {
            element: <NotFoundPageContainer />,
            path: "*",
          },
        ],
      },
    ],
    errorElement: <NotFoundPageContainer />,
  },
];
