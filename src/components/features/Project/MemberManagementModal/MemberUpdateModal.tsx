import {
  Button,
  chakra,
  Flex,
  FormControl,
  FormErrorMessage,
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
import { useEffect } from "react";
import type { SubmitHandler } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import type { MemberResponseDTO } from "../../../../api/generated/data-contracts";
import { useUpdateMember } from "../../../../api/hooks/useUpdateMember";

interface MemberUpdateModalProps extends MemberResponseDTO {
  isOpen: boolean;
  onClose: () => void;
}

type FormData = {
  name: string;
  role: string;
  email: string;
};

export const MemberUpdateModal = ({
  isOpen,
  onClose,
  ...member
}: MemberUpdateModalProps) => {
  const { id: projectId } = useParams();
  const updateMemberMutation = useUpdateMember();
  const toast = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    defaultValues: {
      name: member.name,
      role: member.role,
      email: member.email,
    },
  });

  useEffect(() => {
    if (isOpen) {
      reset({
        name: member.name,
        role: member.role,
        email: member.email,
      });
    }
  }, [isOpen, member.email, member.name, member.role, reset]);

  const onSubmit: SubmitHandler<FormData> = (data) => {
    if (projectId && member.id) {
      updateMemberMutation.mutate(
        {
          projectId: parseInt(projectId),
          memberId: member.id,
          data,
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
              description: errorMessage,
              status: "error",
              duration: 3000,
              isClosable: true,
            });
          },
        }
      );
    }
  };

  const preventEnterKeySubmission = (
    e: React.KeyboardEvent<HTMLFormElement>
  ) => {
    const target = e.target as HTMLFormElement;
    if (e.key === "Enter" && !["TEXTAREA"].includes(target.tagName)) {
      e.preventDefault();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm" isCentered>
      <ModalOverlay />
      <ModalContent
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        onKeyDown={preventEnterKeySubmission}
      >
        <ModalHeader>팀원 정보 수정</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Flex h="95px">
            <FormControl isInvalid={!!errors.name} mt={15}>
              <FormLabel htmlFor="memberName">이름</FormLabel>
              <Input
                autoComplete="name"
                id="memberName"
                {...register("name", {
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
              />
              <StyledFormErrorMessage>
                {errors.name?.message}
              </StyledFormErrorMessage>
            </FormControl>
          </Flex>
          <Flex h="95px">
            <FormControl isInvalid={!!errors.role} mt={15}>
              <FormLabel>역할</FormLabel>
              <Input
                {...register("role", {
                  required: "역할을 입력해주세요.",
                  minLength: {
                    value: 1,
                    message: "역할은 최소 1자 이상이어야 합니다.",
                  },
                  maxLength: {
                    value: 15,
                    message: "역할은 공백 포함 최대 15글자까지 가능합니다.",
                  },
                  setValueAs: (value) => value.trim(),
                })}
              />
              <StyledFormErrorMessage>
                {errors.role?.message}
              </StyledFormErrorMessage>
            </FormControl>
          </Flex>
          <Flex h="95px">
            <FormControl isInvalid={!!errors.email} mt={15}>
              <FormLabel>이메일</FormLabel>
              <Input
                autoComplete="email"
                {...register("email", {
                  required: "이메일을 입력해주세요.",
                  pattern: {
                    value: /\S+@\S+\.\S+/,
                    message: "유효한 이메일 주소를 입력해주세요.",
                  },
                })}
              />
              <StyledFormErrorMessage>
                {errors.email?.message}
              </StyledFormErrorMessage>
            </FormControl>
          </Flex>
        </ModalBody>
        <ModalFooter>
          <Button
            colorScheme="blue"
            mr={3}
            isLoading={isSubmitting}
            type="submit"
          >
            수정
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const StyledFormErrorMessage = chakra(FormErrorMessage, {
  baseStyle: {
    margin: "0px",
    marginTop: "1px",
  },
});
