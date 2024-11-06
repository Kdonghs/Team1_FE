import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  VStack,
} from "@chakra-ui/react";

export const ProfileEditDeleteModal = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const isEditing = false;
  return (
    <>
      <Button onClick={onOpen}>프로필 수정</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>프로필 {isEditing ? "수정" : "삭제"}</ModalHeader>
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>이름</FormLabel>
                <Input type="text" />
              </FormControl>
              <FormControl>
                <FormLabel>이메일</FormLabel>
                <Input type="email" />
              </FormControl>
              <FormControl>
                <FormLabel>전화번호</FormLabel>
                <Input type="tel" />
              </FormControl>
              <FormControl>
                <FormLabel>자기소개</FormLabel>
                <Textarea />
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            (
            <>
              <Button variant="outline">취소</Button>
              <Button colorScheme="blue">저장</Button>
            </>
            ) : (
            <>
              <Button variant="outline">취소</Button>
              <Button colorScheme="red">삭제</Button>
            </>
            )
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
