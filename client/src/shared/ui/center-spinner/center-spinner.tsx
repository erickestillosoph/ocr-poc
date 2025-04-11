import { Flex, Modal, ModalOverlay, Spinner } from "@chakra-ui/react";

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
        <Flex height="100svh" justifyContent="center" alignItems="center">
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
