import { Outlet, type RouteObject } from "react-router-dom";

import {
  NotFoundPageContainer,
<<<<<<< HEAD
=======
  UploadCameraContainer,
  UploadCameraDifyContainer,
>>>>>>> master
  UploadPageContainer,
  ViewResultsPageContainer,
} from "@/pages"
import { NotFoundGuard } from "./not-found-guard";
import { paths } from "@/shared";

export const routes: RouteObject[] = [
  {
    children: [
      {
        element: <Outlet />,
        children: [
          {
<<<<<<< HEAD
            element: <UploadPageContainer />,
=======
            element: <UploadCameraDifyContainer />,
>>>>>>> master
            path: "/",
          },
          {
            element: <UploadPageContainer />,
            path: paths.cameraAccessUploadFile,
          },
          {
            element: <UploadCameraDifyContainer />,
            path: paths.cameraAccessUploadFileDify,
          },
          {
            element: <ViewResultsPageContainer />,
            path: paths.myPage,
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
