import { Outlet, RouteObject } from "react-router-dom";

import {
  NotFoundPageContainer,
  UploadPageContainer,
  ViewResultsPageContainer,
} from "@/pages";
import { NotFoundGuard } from "./not-found-guard";
import { paths } from "@/shared";

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
            path: paths.cameraAccessUploadFile,
          },
          {
            element: <ViewResultsPageContainer />,
            path: paths.viewResultsPage,
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
