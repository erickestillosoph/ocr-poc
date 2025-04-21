import { Heading, HStack, Icon } from '@chakra-ui/react';
import { matchPath, useLocation, useNavigate } from 'react-router-dom';
import { MdArrowBackIos } from 'react-icons/md';
import { PAGE_HEADER_TITLES } from '@/shared/constants/constants';
import { paths } from '@/shared';


// We can add title header for each page here
const HEADER_TITLES = {
  [paths.uploadPage]:
    PAGE_HEADER_TITLES.UPLOAD,
  [paths.cameraAccessUploadFile]:
    PAGE_HEADER_TITLES.CAMERA,
    [paths.viewResultsPage]:
    PAGE_HEADER_TITLES.VIEW_RESULTS,
  
};

const excludedPaths = [
  paths.home,
  paths.search,
  
] as const;

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
          color="blue.500"
          boxSize="24px"
          onClick={() => navigate(-1)}
          as={MdArrowBackIos}
        />
      )}

      <Heading
        fontSize="md"
        color="blue.500"
        fontWeight="bold"
      >
        {headerTitle}
      </Heading>
    </HStack>
  );
};
