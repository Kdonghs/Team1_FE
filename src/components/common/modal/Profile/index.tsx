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
  useToast,
  VStack,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import type { AxiosError } from "axios";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useGetUserData } from "../../../../api/hooks/user.api";
import { useUpdateUser } from "../../../../api/hooks/user.api";
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

interface ProfileForm {
  username: string;
  picture: string;
}

export const ProfileEditingModal: React.FC<ProfileEditingModalProps> = ({
  isOpen,
  onClose,
}) => {
  const toast = useToast();
  const { data } = useGetUserData();
  const updateUserMutation = useUpdateUser();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { isDirty },
  } = useForm<ProfileForm>({
    defaultValues: {
      username: data?.resultData?.username || "",
      picture: data?.resultData?.picture || "",
    },
  });

  useEffect(() => {
    if (data?.resultData?.username && data.resultData.picture) {
      setValue("username", data.resultData.username);
      setValue("picture", data.resultData.picture);
    }
  }, [data, isOpen, setValue]);

  const currentPicture = watch("picture");

  const onSubmit = handleSubmit(async (formData) => {
    updateUserMutation.mutate(
      { data: { username: formData.username, picture: formData.picture } },
      {
        onSuccess: () => {
          toast({
            title: "업데이트 성공",
            description: "프로필이 성공적으로 업데이트되었습니다.",
            status: "success",
            duration: 3000,
            isClosable: true,
          });
          onClose();
        },
        onError: (err: AxiosError) => {
          const errorMessage = err.request.responseText;
          toast({
            title: "업데이트 실패",
            description: errorMessage,
            status: "error",
            duration: 3000,
            isClosable: true,
          });
        },
      },
    );
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay backgroundColor="rgba(0, 0, 0, 0.4)" />
      <StyledModalContent>
        <StyledModalHeader>프로필 설정</StyledModalHeader>
        <StyledModalCloseButton />
        <ModalBody p={0}>
          <form onSubmit={onSubmit}>
            <VStack spacing={4} align="stretch">
              <Flex justify="center" mb={1}>
                <Avatar size="xl" src={currentPicture} />
              </Flex>
              <StyledFormControl>
                <StyledFormLabel>프로필 이미지 URL</StyledFormLabel>
                <StyledInput
                  {...register("picture", {
                    setValueAs: (value) => value.trim(),
                  })}
                  placeholder="이미지 URL을 입력하세요"
                />
              </StyledFormControl>
              <StyledFormControl>
                <StyledFormLabel>이름</StyledFormLabel>
                <StyledInput
                  {...register("username", {
                    required: "이름을 입력해주세요.",
                    minLength: {
                      value: 1,
                      message: "이름은 최소 1자 이상이어야 합니다.",
                    },
                    maxLength: {
                      value: 15,
                      message: "이름은 공백 포함 최대 15글자까지 가능합니다.",
                    },
                    setValueAs: (value) => value.trim(),
                  })}
                  placeholder="이름을 입력하세요"
                />
              </StyledFormControl>
              <Flex gap={2} justifyContent="flex-end" mt={2}>
                <StyledButton action="cancel" onClick={onClose} type="button">
                  취소
                </StyledButton>
                <StyledButton
                  action="submit"
                  type="submit"
                  isDisabled={!isDirty}
                >
                  저장
                </StyledButton>
              </Flex>
            </VStack>
          </form>
        </ModalBody>
      </StyledModalContent>
    </Modal>
  );
};