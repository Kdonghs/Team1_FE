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
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { useGetProjectMembers } from "../../../../api/hooks/useGetProjectMembers";
import { usePostProjectInviteCode } from "../../../../api/hooks/usePostProjectInviteCode";
import { InviteMember } from "./InviteMember";
import { MemberItem } from "./MemberItem";

export const MemberManagementModal = ({
  size = 5,
  sort = "string",
  role = "",
}: {
  size?: number;
  sort?: string;
  role?: string;
}) => {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? parseInt(id, 10) : 0;

  const {
    data: inviteData,
    error: inviteError,
    isLoading: inviteLoading,
  } = usePostProjectInviteCode(projectId);

  const {
    data: membersData,
    error: membersError,
    isLoading: membersLoading,
    fetchNextPage,
    hasNextPage,
  } = useGetProjectMembers(projectId, size, sort, role);

  const [loadingMore, setLoadingMore] = useState(false);

  const loadMoreMembers = () => {
    if (hasNextPage && !loadingMore) {
      setLoadingMore(true);
      fetchNextPage();
    }
  };

  useEffect(() => {
    setLoadingMore(false);
  }, [membersData]);

  if (membersLoading || inviteLoading) {
    return <div>Loading...</div>;
  }

  if (membersError) {
    return <div>{membersError.message}</div>;
  }

  if (inviteError) {
    return <div>{inviteError.message}</div>;
  }

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
              <StyledFlex>
                {membersData?.pages?.length === 0 ||
                membersData?.pages?.every(
                  (page) => page.resultData?.length === 0,
                ) ? (
                  <Text>팀원이 없습니다.</Text>
                ) : (
                  membersData?.pages?.map((page, pageIndex) => (
                    <div key={pageIndex}>
                      {page.resultData?.map((member, index) => {
                        if (member.id) {
                          return (
                            <MemberItem
                              key={`${member.id}-${index}`}
                              {...member}
                            />
                          );
                        }
                        return null;
                      })}
                    </div>
                  ))
                )}

                {loadingMore && <Text>Loading more...</Text>}

                {hasNextPage && (
                  <div
                    ref={(ref) => {
                      if (ref) {
                        const observer = new IntersectionObserver(
                          (entries) => {
                            if (entries[0].isIntersecting) {
                              loadMoreMembers();
                            }
                          },
                          { threshold: 1.0 },
                        );
                        observer.observe(ref);
                      }
                    }}
                  />
                )}
              </StyledFlex>
            </Flex>
          </VStack>
        </ModalBody>

        <ModalFooter />
      </StyledModalContent>
    </>
  );
};

const StyledModalContent = styled(ModalContent)`
  border-radius: 16.23px;
  padding: 0.5em;
  overflow: hidden;
`;

const StyledFlex = styled(Flex)`
  flex-direction: column;
  width: 100%;
  gap: 2;
  overflow-y: auto;
  max-height: 320px;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: #f1f1f1;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb {
    background: #cdd0ff;
    border-radius: 10px;
  }

  &::-webkit-scrollbar-thumb:hover {
    background: #95a4fc;
  }
`;
