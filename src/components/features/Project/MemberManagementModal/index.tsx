import {
  Flex,
  Heading,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  VStack,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useParams } from "react-router-dom";

import { useGetProjectInviteCode } from "../../../../api/hooks/useGetProjectInviteCode";
import { useGetProjectMembers } from "../../../../api/hooks/useGetProjectMembers";
import { InviteMember } from "./InviteMember";
import { MemberItem } from "./MemberItem";
export const MemberManagementModal = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? parseInt(id, 10) : null;

  const {
    data: inviteData,
    error: inviteError,
    isLoading: inviteLoading,
  } = useGetProjectInviteCode(projectId);

  const {
    data: membersData,
    error: membersError,
    isLoading: membersLoading,
  } = useGetProjectMembers(projectId);

  if (membersLoading || inviteLoading) {
    return <div>Loading...</div>;
  }

  if (membersError) {
    return <div>{membersError.message}</div>;
  }

  if (inviteError) {
    return <div>{inviteError.message}</div>;
  }
  console.log(membersData);
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
            {inviteData?.resultData && (
              <InviteMember resultData={inviteData.resultData} />
            )}
            <Flex width="100%" flexDirection="column" gap={3}>
              <Heading as="h4" size="md">
                팀원 편집
              </Heading>
              {/* TODO: 페이지네이션으로 팀원 받아오기 구현 */}
              <Flex flexDirection="column" width="100%" gap={2}>
                {membersData?.resultData &&
                Array.isArray(membersData.resultData) ? (
                  membersData.resultData.map((member) => (
                    <MemberItem key={member.email} {...member} />
                  ))
                ) : (
                  <Text>팀원이 없습니다.</Text>
                )}
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
