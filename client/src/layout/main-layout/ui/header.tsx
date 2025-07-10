import { Heading, HStack, Icon } from '@chakra-ui/react';
// import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';


import { PAGE_HEADER_TITLES } from '@/shared/constants/constants';
import { paths } from '@/shared';
import { useAppTheme } from '@/shared/theme';

// We can add title header for each page here
const HEADER_TITLES = {
  [paths.read ]:
    PAGE_HEADER_TITLES.READ,
};
const excludedPaths = [paths.read, paths.myPage, paths.employeeManagement];

 
export const Header = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const matchedRoute = Object.keys(HEADER_TITLES).find((path) =>
    matchPath(path, location.pathname),
  );
  const headerTitle = matchedRoute ? HEADER_TITLES[matchedRoute] : '';
  const isNavigatePreviousIconShow = excludedPaths.some((path) =>
    matchPath(path, location.pathname),
  );
  const { theme } = useAppTheme();
  return (
    <HStack
      as="header"
      justifyContent="center"
      bg="white"
      position="fixed"
      top="0"
      width="100%"
      padding="12px"
      zIndex="1000"
      borderBottom="1px solid"
      borderColor="gray.200"
      height="12"
    >
      {!isNavigatePreviousIconShow && (
        <Icon
          position="absolute"
          left="4"
          color="primary.500"
          boxSize="24px"
          onClick={() => navigate(-1)}
          // as={ChevronLeftIcon}
        />
      )}

      <Heading
        fontSize="16px"
        fontWeight="bold"
        textColor={theme.colors.blue}
      >
        {headerTitle}
      </Heading>
    </HStack>
  );
};
