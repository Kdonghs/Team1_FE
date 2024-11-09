import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useToast,
} from "@chakra-ui/react";
import type { AxiosError } from "axios";
import { useState } from "react";
import { useParams } from "react-router-dom";

import type { MemberResponseDTO } from "../../../../api/generated/data-contracts";
import { useUpdateMember } from "../../../../api/hooks/useUpdateMember";

interface MemberUpdateModalProps extends MemberResponseDTO {
  isOpen: boolean;
  onClose: () => void;
}

export const MemberUpdateModal = ({
  isOpen,
  onClose,
  ...member
}: MemberUpdateModalProps) => {
  const [name, setName] = useState(member.name);
  const [role, setRole] = useState(member.role);
  const [email, setEmail] = useState(member.email);

  const { id: projectId } = useParams();
  const updateMemberMutation = useUpdateMember();
  const toast = useToast();

  const handleUpdate = () => {
    if (projectId && member.id) {
      updateMemberMutation.mutate(
        {
          projectId: parseInt(projectId),
          memberId: member.id,
          data: { name, role, email },
        },
        {
          onSuccess: () => {
            toast({
              title: "업데이트 성공",
              description: "팀원 정보가 성공적으로 업데이트되었습니다.",
              status: "success",
              duration: 3000,
              isClosable: true,
            });
            onClose();
          },
          onError: (error: AxiosError) => {
            const errorMessage = error.request.responseText;
            toast({
              title: "업데이트 실패",
              description: `${errorMessage}`,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          },
        }
      );
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>팀원 정보 수정</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <FormControl mt={4}>
            <FormLabel>이름</FormLabel>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>역할</FormLabel>
            <Input value={role} onChange={(e) => setRole(e.target.value)} />
          </FormControl>
          <FormControl mt={4}>
            <FormLabel>이메일</FormLabel>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} />
          </FormControl>
          {/* 추후 이미지 변경 기능 추가 */}
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleUpdate}>
            업데이트
          </Button>
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};
