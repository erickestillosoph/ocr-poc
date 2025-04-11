import { BiUser, BiHome, BiSearch } from "react-icons/bi";
import { FaRegUser } from "react-icons/fa6";
import { PAGE_BOTTOM_TITLES, paths } from "@/shared";

export const driverNavigationItems = [
  {
    label: PAGE_BOTTOM_TITLES.HOME,
    path: paths.cameraAccess,
    icon: BiHome,
  },
  {
    label: PAGE_BOTTOM_TITLES.SEARCH,
    path: paths.search,
    icon: BiSearch,
  },
  {
    label: PAGE_BOTTOM_TITLES.PEOPLE,
    path: paths.oldUiUpload,
    icon: BiUser,
  },
  {
    label: PAGE_BOTTOM_TITLES.USER,
    path: paths.viewResultsPage,
    icon: FaRegUser,
  },
];
