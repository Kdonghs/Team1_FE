import {
  Avatar,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";

import type { Profile } from "../../../../types";

interface ProfileEditingModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileData: Profile | null;
  onUpdateProfile: (username: string, picture: string) => Promise<void>;
}

const StyledModalContent = styled(ModalContent)`
  border-radius: 16.23px;
  padding: 2em 2.5em;
  max-width: 460px;
  width: 95%;
  background: #ffffff;
  box-shadow:
    0 4px 6px -1px rgba(0, 0, 0, 0.1),
    0 2px 4px -1px rgba(0, 0, 0, 0.06);
`;

const StyledButton = styled(Button)<{ action: string }>`
  height: 46px;
  padding: 4px 8px;
  width: 120px;
  background-color: ${({ action }) =>
    action === "submit" ? "#95a4fc" : "white"};
  color: ${({ action }) => (action === "submit" ? "white" : "#333")};
  border: ${({ action }) => (action === "submit" ? "none" : "1px solid #ddd")};
  border-radius: 8px;
  font-weight: 500;
  &:hover {
    background-color: ${({ action }) =>
      action === "submit" ? "#8494fc" : "#f5f5f5"};
  }
`;

const StyledFormControl = styled(FormControl)`
  margin-bottom: 16px;
  width: 100%;
`;

const StyledFormLabel = styled(FormLabel)`
  color: #333;
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 6px;
`;

const StyledInput = styled(Input)`
  height: 46px;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 0 16px;
  background: white;
  font-size: 0.95rem;
  &:focus {
    border-color: #95a4fc;
    box-shadow: 0 0 0 1px #95a4fc;
  }
  &:hover {
    border-color: #95a4fc;
  }
  &::placeholder {
    color: #999;
  }
`;

const StyledModalHeader = styled(ModalHeader)`
  font-size: 24px;
  font-weight: 700;
  color: #333;
  padding: 0;
  margin-bottom: 20px;
`;

const StyledModalCloseButton = styled(ModalCloseButton)`
  top: 24px;
  right: 24px;
  color: #666;
`;

export const ProfileEditingModal: React.FC<ProfileEditingModalProps> = ({
  isOpen,
  onClose,
  profileData,
  onUpdateProfile,
}) => {
  const [editedUsername, setEditedUsername] = useState(
    profileData?.username ?? "",
  );
  const [editedPicture, setEditedPicture] = useState(
    profileData?.picture ?? "",
  );

  // 모달이 열릴 때마다 초기값 설정
  useEffect(() => {
    if (profileData) {
      setEditedUsername(profileData.username);
      setEditedPicture(profileData.picture);
    }
  }, [profileData, isOpen]);

  const handleSubmit = async () => {
    await onUpdateProfile(editedUsername, editedPicture);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backgroundColor="rgba(0, 0, 0, 0.4)" />
      <StyledModalContent>
        <StyledModalHeader>프로필 설정</StyledModalHeader>
        <StyledModalCloseButton />
        <ModalBody p={0}>
          <VStack spacing={4} align="stretch">
            <Flex justify="center" mb={1}>
              <Avatar size="xl" src={editedPicture || profileData?.picture} />
            </Flex>
            <StyledFormControl>
              <StyledFormLabel>프로필 이미지 URL</StyledFormLabel>
              <StyledInput
                value={editedPicture}
                onChange={(e) => setEditedPicture(e.target.value)}
                placeholder="이미지 URL을 입력하세요"
              />
            </StyledFormControl>
            <StyledFormControl>
              <StyledFormLabel>이름</StyledFormLabel>
              <StyledInput
                value={editedUsername}
                onChange={(e) => setEditedUsername(e.target.value)}
                placeholder="이름을 입력하세요"
              />
            </StyledFormControl>
            <Flex gap={2} justifyContent="flex-end" mt={2}>
              <StyledButton action="cancel" onClick={onClose}>
                취소
              </StyledButton>
              <StyledButton action="submit" onClick={handleSubmit}>
                저장
              </StyledButton>
            </Flex>
          </VStack>
        </ModalBody>
      </StyledModalContent>
    </Modal>
  );
};
