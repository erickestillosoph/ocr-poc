import { PAGE_BOTTOM_TITLES, paths } from "@/shared";
import {
  AiOutlineFileSearch,
  AiOutlineFileDone,
  AiOutlineFileAdd,
} from "react-icons/ai";

//TODO:  Hide the first tab previous implementation
export const driverNavigationItems = [
  {
    label: PAGE_BOTTOM_TITLES.UPLOAD,
    path: paths.cameraAccessUploadFile,
    icon: AiOutlineFileSearch,
  },
  {
    label: PAGE_BOTTOM_TITLES.UPLOAD_DIFY,
    path: paths.cameraAccessUploadFileDify,
    icon: AiOutlineFileAdd,
  },
  {
    label: PAGE_BOTTOM_TITLES.MY_PAGE,
    path: paths.viewResultsPage,
    icon: AiOutlineFileDone,
  },
];
