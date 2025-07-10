import {
  Box,
  Flex,
  Modal,
  ModalOverlay,
  Spinner,
  Text,
} from "@chakra-ui/react";

type Props = {
  loading: boolean;
};

export const CenterSpinner = ({ loading }: Props) => {
  return (
    <Modal
      isOpen={loading}
      onClose={() => {}}
      scrollBehavior="inside"
      size="xl"
    >
      <ModalOverlay zIndex={2000}>
        <Flex
          height="100svh"
          justifyContent="center"
          alignItems="center"
          flexDirection="column"
          gap={4}
        >
          <Box bg="white" p={4} borderRadius="md">
            <Text fontSize="16px" fontWeight="bold">
              「読み取り中です (20 ~ 30秒程度かかります)」
            </Text>
          </Box>
          <Spinner
            thickness="4px"
            size="xl"
            speed="0.65s"
            emptyColor="gray.200"
            color="primary.400"
          />
        </Flex>
      </ModalOverlay>
    </Modal>
  );
};
