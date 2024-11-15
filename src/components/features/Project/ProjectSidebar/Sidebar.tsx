import { ChevronLeftIcon } from "@chakra-ui/icons";
import { Box, Button, Flex, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import { useGetProjectDetail } from "../../../../api/hooks/project.api";
import { authSessionStorage } from "../../../../utils/storage";
import { ProjectInfo } from "../ProjectInfo";
import { MyMemberProfile } from "./MyMemberProfile";
import { UserProfile } from "./UserProfile";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? parseInt(id, 10) : null;

  const { data } = useGetProjectDetail(projectId);

  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    const authData = authSessionStorage.get();
    if (authData) {
      setRole(authData.role);
    }
  }, []);

  return (
    <Box
      width="250px"
      height="100vh"
      bg="gray.100"
      p={4}
      boxShadow="lg"
      transition="margin-left 0.3s ease, opacity 0.3s ease"
      marginLeft={isOpen ? "0" : "-250px"}
      opacity={isOpen ? 1 : 0}
      position="fixed"
      zIndex={10}
    >
      <Flex justifyContent="space-between" padding={2}>
        {role === "USER" ? (
          <Link to={`/projects`}>
            <Text fontSize="3xl" fontWeight="bold">
              Seamless
            </Text>
          </Link>
        ) : role === "MEMBER" ? (
          <Text fontSize="3xl" fontWeight="bold">
            Seamless
          </Text>
        ) : null}

        <Button
          onClick={onClose}
          borderRadius="full"
          backgroundColor="transparent"
          _hover={{ backgroundColor: "gray.200" }}
        >
          <ChevronLeftIcon boxSize={5} />
        </Button>
      </Flex>

      <Flex>
        {role === "USER" ? (
          <UserProfile />
        ) : role === "MEMBER" ? (
          <MyMemberProfile />
        ) : null}
      </Flex>
      <Stack padding={2} gap={8}>
        <Stack gap={2}>
          <Text fontSize="20px" fontWeight="bold">
            Menu
          </Text>

          <Flex direction="column">
            <Link to={`/projects/${projectId}`}>
              <Text mt={2} mb={2}>
                프로젝트 홈
              </Text>
            </Link>
            <Link to={`/projects/${projectId}/kanban`}>
              <Text mt={2} mb={2}>
                칸반 보드
              </Text>
            </Link>
          </Flex>
        </Stack>
      </Stack>
      {data && <ProjectInfo projectDetail={data} />}
    </Box>
  );
};
