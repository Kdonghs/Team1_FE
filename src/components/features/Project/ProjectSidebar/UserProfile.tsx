import { EditIcon } from "@chakra-ui/icons";
import {
  Avatar,
  Button,
  Flex,
  FormControl,
  FormLabel,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import type { AxiosError } from "axios";
import { EllipsisVertical, LogOutIcon } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import { useGetUserData } from "../../../../api/hooks/useGetUserdata";
import { useUpdateUser } from "../../../../api/hooks/useUpdateUserdata";
import { useAuth } from "../../../../provider/Auth";

interface UserProfileForm {
  username: string;
}

export const UserProfile = () => {
  const { data, error, isLoading } = useGetUserData();
  const { onOpen, onClose, isOpen } = useDisclosure();
  const { user, logout } = useAuth();
  const updateMemberMutation = useUpdateUser();
  const toast = useToast();

  const handleAuthLogout = () => {
    if (user) {
      console.log("Logging out user:", user);
      logout();
    }
  };

  const {
    register,
    handleSubmit,
    setValue,
    formState: { isDirty },
  } = useForm<UserProfileForm>({
    defaultValues: {
      username: data?.resultData?.username || "",
    },
  });

  useEffect(() => {
    if (data?.resultData?.username) {
      setValue("username", data.resultData.username);
    }
  }, [data, setValue]);

  if (error) return <div>error...</div>;
  if (isLoading) return <div>Loading...</div>;

  const handleSave = (formData: UserProfileForm) => {
    if (formData.username !== data?.resultData?.username) {
      updateMemberMutation.mutate(
        { data: { username: formData.username } },
        {
          onSuccess: () => {
            toast({
              title: "업데이트 성공",
              description: "유저 정보가 성공적으로 업데이트되었습니다.",
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
    } else {
      onClose();
    }
  };

  return (
    <Flex width="100%" alignItems="center" justify="space-between">
      <Flex alignItems="center" width="100%">
        <Avatar src={data?.resultData?.picture} size="md" margin={2} />
        <Flex flexDir="column" justifyContent="center">
          <Text fontSize="lg" fontWeight="bold">
            {data?.resultData?.username}
          </Text>
          <Text fontSize="sm" color="gray">
            {data?.resultData?.role}
          </Text>
        </Flex>
      </Flex>

      <Menu>
        <MenuButton
          as={IconButton}
          className="menu-icon"
          bgColor="transparent"
          aria-label="More member options"
          icon={<EllipsisVertical color="#5A5A5A" />}
          size="xs"
          mt={3}
        />
        <MenuList
          minW="120px"
          boxShadow="md"
          border="1px solid"
          borderColor="gray.100"
          zIndex={10}
        >
          <MenuItem textAlign="center" onClick={onOpen} icon={<EditIcon />}>
            프로필 수정
          </MenuItem>

          <MenuItem
            textAlign="center"
            onClick={handleAuthLogout}
            icon={<LogOutIcon size={13} />}
          >
            로그아웃
          </MenuItem>
        </MenuList>
      </Menu>

      <Modal isOpen={isOpen} onClose={onClose} size="xs">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>프로필 수정</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit(handleSave)}>
              <FormControl id="username">
                <FormLabel>이름</FormLabel>
                <Input
                  id="memberName"
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
                  placeholder="변경할 이름 입력"
                  px={3}
                />
              </FormControl>
              <ModalFooter pr={0}>
                <Button colorScheme="blue" type="submit" isDisabled={!isDirty}>
                  저장
                </Button>
              </ModalFooter>
            </form>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Flex>
  );
};
