import { Avatar, Flex, IconButton, Text } from "@chakra-ui/react";
import styled from "@emotion/styled";
import { Ellipsis } from "lucide-react";

import type { TeamMember } from "@/types";

export const MemberItem = (member: TeamMember) => {
  return (
    <Flex
      width="100%"
      alignItems="center"
      justifyContent="space-between"
      _hover={{ backgroundColor: "#F6F6F6", borderRadius: "0.375rem" }}
      height="60px"
      transition="background-color 0.2s"
    >
      <MemberProfile>
        <Avatar name={member.name} src={member.imageURL} size="sm" margin={2} />
        <Flex flexDir="column" justifyContent="center">
          <Text fontSize="md" fontWeight="bold">
            {member.name}
          </Text>
          <Text fontSize="xs" color="gray">
            {member.role}
          </Text>
        </Flex>
      </MemberProfile>
      <IconButton
        bgColor="transparent"
        aria-label="More member options"
        icon={<Ellipsis color="#5A5A5A" />}
        size="sm"
        m={1}
      />
    </Flex>
  );
};

const MemberProfile = styled.div`
  display: flex;
  align-items: center;
`;
