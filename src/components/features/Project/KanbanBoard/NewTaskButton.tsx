import { AddIcon } from "@chakra-ui/icons";
import { Flex, IconButton, useDisclosure } from "@chakra-ui/react";

import { TaskModal } from "./modal/TaskModal";

export const AddTaskButton = ({ projectId }: { projectId: number }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Flex justifyContent="center">
        <IconButton
          isRound
          variant="solid"
          aria-label="AddTask"
          fontSize="20px"
          icon={<AddIcon />}
          bg="transparent"
          color="#727272"
          onClick={onOpen}
        />
      </Flex>

      <TaskModal isOpen={isOpen} onClose={onClose} projectId={projectId} />
    </>
  );
};
