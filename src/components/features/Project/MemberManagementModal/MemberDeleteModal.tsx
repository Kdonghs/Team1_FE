import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
  VStack,
} from "@chakra-ui/react";
import type { AxiosError } from "axios";
import { useParams } from "react-router-dom";

import type { MemberResponseDTO } from "../../../../api/generated/data-contracts";
import { useDeleteMember } from "../../../../api/hooks/useDeleteMember";
import { MemberProfile } from "./MemberProfile";

interface MemberDeleteModalProps extends MemberResponseDTO {
  isOpen: boolean;
  onClose: () => void;
}

export const MemberDeleteModal = ({
  isOpen,
  onClose,
  ...member
}: MemberDeleteModalProps) => {
  const projectId = useParams().id;
  const mutation = useDeleteMember();
  const toast = useToast();

  const handleDelete = () => {
    if (projectId && member.id) {
      mutation.mutate(
        { projectId: parseInt(projectId), memberId: member.id },
        {
          onSuccess: () => {
            toast({
              title: "팀원 삭제 성공",
              description: `${member.name} 팀원이 삭제되었습니다.`,
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            onClose();
          },
          onError: (error: AxiosError) => {
            const errorMessage = error.request.responseText;

            toast({
              title: "팀원 삭제 실패",
              description: `${errorMessage}`,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          },
        },
      );
    } else {
      console.error("프로젝트 ID 또는 멤버 ID가 없습니다.");
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>팀원 삭제</ModalHeader>
        <ModalBody>
          <VStack>
            <Box p={2}>
              <MemberProfile {...member} />
            </Box>
            <Text fontWeight="bold">정말 해당 팀원을 삭제하시겠습니까?</Text>
            <Text color="red.500">이 작업은 되돌릴 수 없습니다.</Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Flex direction="column" flex={1} gap={3}>
            <Button
              colorScheme="red"
              size="sm"
              onClick={handleDelete}
              width="100%"
            >
              삭제
            </Button>
            <Button variant="outline" size="sm" onClick={onClose} width="100%">
              취소
            </Button>
          </Flex>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
