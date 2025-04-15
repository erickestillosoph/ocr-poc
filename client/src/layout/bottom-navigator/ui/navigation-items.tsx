import { FaRegUser, FaUsers, FaRegFile } from "react-icons/fa6";
import { PAGE_BOTTOM_TITLES, paths } from "@/shared";

export const NavigationItems = [
  {
    label: PAGE_BOTTOM_TITLES.HOME,
    path: paths.cameraAccessUploadFile,
    icon: FaRegFile,
  },
  {
    label: PAGE_BOTTOM_TITLES.SEARCH,
    path: paths.search,
    icon: FaUsers,
  },
  {
    label: PAGE_BOTTOM_TITLES.USER,
    path: paths.viewResultsPage,
    icon: FaRegUser,
  },
];
