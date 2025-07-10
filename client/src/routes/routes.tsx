import { Outlet, type RouteObject } from "react-router-dom";

import {
  NotFoundPageContainer,
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
            element: <UploadPageContainer />,
            path: paths.uploadPage,
          },
          {
            element: <UploadCameraDifyContainer />,
            path: paths.cameraAccessUploadFileDify,
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
