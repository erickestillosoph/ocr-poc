import { FaUsers, FaRegCircleUser } from "react-icons/fa6";
import { PAGE_BOTTOM_TITLES, paths } from "@/shared";
import { AiOutlineFileSearch } from "react-icons/ai";
export const driverNavigationItems = [
  {
    label: PAGE_BOTTOM_TITLES.UPLOAD,
    path: paths.uploadPage,
    icon: AiOutlineFileSearch,
  },
  {
    label: PAGE_BOTTOM_TITLES.PEOPLE,
    path: paths.search,
    icon: FaUsers,
  },
  {
    label: PAGE_BOTTOM_TITLES.MY_PAGE,
    path: paths.viewResultsPage,
    icon: FaRegCircleUser,
  },
];
