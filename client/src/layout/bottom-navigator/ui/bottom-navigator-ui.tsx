import { useAppTheme } from "@/shared/theme";
import { HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { useNavigate, useLocation } from "react-router-dom";

type NavigationItem = {
  label: string;
  icon: React.ElementType;
  path: string;
  showUnreadDot?: boolean;
};

type Props = {
  navigationItems: NavigationItem[];
};

export const BottomNavigationBar = ({ navigationItems }: Props) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme } = useAppTheme();

  const isActive = (path: string) => location.pathname.startsWith(path);

  return (
    <HStack
      as="nav"
      bg={theme.colors.white}
      position="fixed"
      display="flex"
      justifyContent="space-between"
      bottom="0"
      width="100%"
      boxShadow="md"
      zIndex="1000"
      borderTop="1px"
      padding="0px"
      borderColor={theme.colors.gray[200]}
    >
      <HStack
        display="flex"
        justifyContent="space-evenly"
        margin="0 auto"
        width="100%"
        padding="0px"
      >
        {navigationItems.map((item, index) => (
          <VStack
            key={index}
            onClick={() => navigate(item.path)}
            color={
              isActive(item.path) ? theme.colors.white : theme.colors.gray[400]
            }
            height="64px"
            alignItems="center"
            justifyContent="center"
            gap="5px"
            position="relative"
            padding="0px"
            margin="0px"
            backgroundColor={isActive(item.path) ? "#1681BC" : "white"}
            flex="1"
          >
            <Icon as={item.icon} boxSize="20px" />
            <Text fontSize="xs">{item.label}</Text>
          </VStack>
        ))}
      </HStack>
    </HStack>
  );
};
