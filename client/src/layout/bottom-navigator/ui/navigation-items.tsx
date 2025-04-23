import { PAGE_BOTTOM_TITLES, paths } from "@/shared";
import { AiOutlineFileSearch, AiOutlineFileDone } from "react-icons/ai";
export const driverNavigationItems = [
  {
    label: PAGE_BOTTOM_TITLES.UPLOAD,
    path: paths.cameraAccessUploadFile,
    icon: AiOutlineFileSearch,
  },
  {
    label: PAGE_BOTTOM_TITLES.MY_PAGE,
    path: paths.viewResultsPage,
    icon: AiOutlineFileDone,
  },
];
