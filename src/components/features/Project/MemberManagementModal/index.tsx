import {
  Flex,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  VStack,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";

import type { TeamMember } from "@/types";

import { InviteMember } from "./InviteMember";
import { MemberItem } from "./MemberItem";
export const MemberManagementModal = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [mockData] = useState<TeamMember[]>([
    {
      id: 1,
      name: "김땡땡",
      role: "designer",
      imageURL: "",
    },
    {
      id: 2,
      name: "이땡땡",
      role: "developer",
      imageURL: "",
    },
    {
      id: 3,
      name: "박땡땡",
      role: "developer",
      imageURL: "",
    },
    {
      id: 4,
      name: "최땡땡",
      role: "developer",
      imageURL: "",
    },
  ]);
  useEffect(() => {
    setTeamMembers(mockData);
  }, [mockData]);

  return (
    <>
      <ModalOverlay />
      <StyledModalContent>
        <ModalHeader fontSize={26} fontWeight={800} pb={10}>
          프로젝트 팀원 관리
        </ModalHeader>
        <ModalCloseButton m={5} />

        <ModalBody>
          <VStack gap={10}>
            <InviteMember />
            <Flex width="100%" flexDirection="column" gap={3}>
              <Heading as="h4" size="md">
                팀원 편집
              </Heading>
              {/* TODO: 페이지네이션으로 팀원 받아오기 구현 */}
              <Flex flexDirection="column" width="100%" gap={2}>
                {teamMembers.map((member) => (
                  <MemberItem key={member.id} {...member} />
                ))}
              </Flex>
            </Flex>
          </VStack>
        </ModalBody>

        <ModalFooter></ModalFooter>
      </StyledModalContent>
    </>
  );
};

const StyledModalContent = styled(ModalContent)`
  border-radius: 16.23px;
  padding: 0.5em;
  overflow: hidden;
`;
