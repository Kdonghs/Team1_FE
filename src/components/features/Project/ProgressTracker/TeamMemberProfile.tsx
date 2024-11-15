import { Avatar, Flex, Link, Text, Tooltip } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

export const TeamMemberProfile = ({
  teamMember,
}: {
  teamMember?: { id?: number; name?: string; role?: string; imageURL?: string };
}) => {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? parseInt(id, 10) : 0;

  return (
    <Tooltip
      label={`${teamMember?.name}의 칸반보드 이동`}
      placement="auto-start"
      maxW="200px"
      openDelay={500}
      borderRadius={5}
      bgColor="gray.600"
    >
      <Link
        href={`/projects/${projectId}/kanban/?owner=${teamMember?.id}`}
        _hover={{ textDecoration: "none" }}
      >
        <Flex
          alignItems="center"
          p={1}
          position="relative"
          cursor="pointer"
          _hover={{ backgroundColor: "#F6F6F6", borderRadius: "0.5rem" }}
          height="50px"
          py={8}
          transition="background-color 0.2s"
        >
          <Avatar
            name={teamMember?.name}
            src={teamMember?.imageURL}
            size="sm"
          />
          <Text fontWeight="bold" ml={4} width="100px" align="center">
            {teamMember?.name}
          </Text>
        </Flex>
      </Link>
    </Tooltip>
  );
};
