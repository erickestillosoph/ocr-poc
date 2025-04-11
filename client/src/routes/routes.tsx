import { Outlet, RouteObject } from "react-router-dom";

import {
  CameraAccessContainer,
  NotFoundPageContainer,
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
            element: <CameraAccessContainer />,
            path: "/",
          },
          {
            element: <CameraAccessContainer />,
            path: paths.cameraAccess,
          },
          {
            element: <UploadPageContainer />,
            path: paths.uploadPage,
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
