import {
  Avatar,
  Box,
  Button,
  Container,
  Flex,
  Modal,
  Text,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import React from "react";
import { Link } from "react-router-dom";

import { LoginModal } from "../../../components/common/modal/Login";
import { ProfileEditingModal } from "../../../components/common/modal/Profile";
import { useAuth } from "../../../provider/Auth";
import { RouterPath } from "../../../routes/path";
import type { Profile } from "../../../types";

export const Header: React.FC = () => {
  const { user, login, logout } = useAuth();
  const {
    isOpen: isLoginOpen,
    onClose: onLoginClose,
  } = useDisclosure();
  const {
    onOpen: onProfileOpen,
    isOpen: isProfileOpen,
    onClose: onProfileClose,
  } = useDisclosure();
  const toast = useToast();

  const handleUpdateProfile = async (username: string, picture: string) => {
    try {
      const response = await fetch("https://seamlessup.com/api/user", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          picture,
        }),
      });

      if (!response.ok) {
        throw new Error("프로필 수정에 실패했습니다.");
      }

      const data = await response.json();

      if (data.resultData) {
        const currentUser = JSON.parse(localStorage.getItem("user") || "{}");
        const updatedUser = {
          ...currentUser,
          username: data.resultData.username,
          picture: data.resultData.picture,
        };
        localStorage.setItem("user", JSON.stringify(updatedUser));

        onProfileClose();
        toast({
          title: "프로필이 수정되었습니다.",
          status: "success",
          duration: 3000,
        });
        window.location.reload();
      }
    } catch (error) {
      toast({
        title: "프로필 수정 실패",
        description:
          error instanceof Error
            ? error.message
            : "알 수 없는 오류가 발생했습니다.",
        status: "error",
        duration: 3000,
      });
    }
  };

  const handleAuthAction = () => {
    if (user) {
      logout();
    } else {
      login();
    }
  };

  return (
    <Box>
      <Container maxW="container.xl">
        <Flex justifyContent="space-between" alignItems="center" py={6}>
          <Link to={user ? RouterPath.projectList : RouterPath.root}>
            <Text fontSize="4xl" fontWeight="bold">
              Seamless
            </Text>
          </Link>

          <Flex gap={4} alignItems="center">
            {user && (
              <Flex
                alignItems="center"
                bg="white"
                p={2}
                borderRadius="8px"
                border="1px solid #ddd"
                cursor="pointer"
                onClick={onProfileOpen}
                _hover={{ borderColor: "#95a4fc" }}
              >
                <Avatar size="sm" src={user.picture} />
                <Box ml={2}>
                  <Text fontWeight="500" color="#333">
                    {user.username}
                  </Text>
                  <Text fontSize="sm" color="#666">
                    {user.email}
                  </Text>
                </Box>
              </Flex>
            )}

            <StyledButton action="cancel" onClick={handleAuthAction}>
              {user ? "로그아웃" : "로그인"}
            </StyledButton>
          </Flex>

          <Modal isOpen={isLoginOpen} onClose={onLoginClose} isCentered>
            <LoginModal onClose={onLoginClose} />
          </Modal>

          <ProfileEditingModal
            isOpen={isProfileOpen}
            onClose={onProfileClose}
            profileData={user as Profile}
            onUpdateProfile={handleUpdateProfile}
          />
        </Flex>
      </Container>
    </Box>
  );
};

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