import { FaRegCircleUser } from "react-icons/fa6";
import { PAGE_BOTTOM_TITLES, paths } from "@/shared";
import { AiOutlineFileSearch } from "react-icons/ai";
import { MdPeopleOutline } from "react-icons/md";
export const driverNavigationItems = [
  {
    label: PAGE_BOTTOM_TITLES.READ,
    path: paths.read,
    icon: AiOutlineFileSearch,
  },
  {
    label: PAGE_BOTTOM_TITLES.EMPLOYEE_MANAGEMENT,
    path: paths.employeeManagement,
    icon: MdPeopleOutline,
  },
  {
    label: PAGE_BOTTOM_TITLES.MY_PAGE,
    path: paths.myPage,
    icon: FaRegCircleUser,
  },
];
