import {
  Avatar,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { EllipsisVertical, LogOutIcon } from "lucide-react";
import { useParams } from "react-router-dom";

import { useGetMyMember } from "../../../../api/hooks/project.api";
import { RouterPath } from "../../../../routes/path";
import { authSessionStorage } from "../../../../utils/storage";

export const MyMemberProfile = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? parseInt(id, 10) : null;
  const {
    data: memberData,
    error: memberError,
    isLoading: memberIsloading,
  } = useGetMyMember(projectId);

  const memberLogout = () => {
    authSessionStorage.set(undefined);
    localStorage.removeItem("user");

    window.location.href = RouterPath.root;
  };

  if (memberError) return <div>error...</div>;
  if (memberIsloading) return <div>Loading...</div>;

  return (
    <Flex width="100%" alignItems="center" justify="space-between">
      <Flex alignItems="center" width="100%">
        <Avatar name={memberData?.name} size="md" margin={2} />
        <Flex flexDir="column" justifyContent="center">
          <Text fontSize="lg" fontWeight="bold">
            {memberData?.name}
          </Text>
          <Text fontSize="sm" color="gray">
            {memberData?.role}
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
          <MenuItem
            textAlign="center"
            onClick={memberLogout}
            icon={<LogOutIcon size={13} />}
          >
            로그아웃
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};
