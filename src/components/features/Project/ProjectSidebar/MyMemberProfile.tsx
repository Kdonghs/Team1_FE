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
import { useAuth } from "../../../../provider/Auth";

export const MyMemberProfile = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? parseInt(id, 10) : null;
  const { data, error, isLoading } = useGetMyMember(projectId);

  const { user, logout } = useAuth();

  const handleAuthLogout = () => {
    if (user) {
      console.log("Logging out user:", user);
      logout();
    }
  };
  console.log(data);
  if (error) return <div>error...</div>;
  if (isLoading) return <div>Loading...</div>;

  return (
    <Flex width="100%" alignItems="center" justify="space-between">
      <Flex alignItems="center" width="100%">
        <Avatar src={data?.name} size="md" margin={2} />
        <Flex flexDir="column" justifyContent="center">
          <Text fontSize="lg" fontWeight="bold">
            {data?.name}
          </Text>
          <Text fontSize="sm" color="gray">
            {data?.role}
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
            onClick={handleAuthLogout}
            icon={<LogOutIcon size={13} />}
          >
            로그아웃
          </MenuItem>
        </MenuList>
      </Menu>
    </Flex>
  );
};
