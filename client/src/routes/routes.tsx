import { Outlet, RouteObject } from "react-router-dom";

import { CameraAccessContainer, NotFoundPageContainer, UploadPageContainer, ViewResultsPageContainer } from "@/pages";
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
            element: <UploadPageContainer />,
            path: "/",
          },
          {
            element: <UploadPageContainer />,
            path: paths.uploadPage,
          },
          {
            element: <CameraAccessContainer />,
            path: paths.cameraAccessUploadFile,
          },
          {
            element: <ViewResultsPageContainer />,
            path: paths.viewResultsPage,
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
