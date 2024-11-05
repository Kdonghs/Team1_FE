import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import {
  Flex,
  Heading,
  IconButton,
  Input,
  InputGroup,
  Text,
  useClipboard,
} from "@chakra-ui/react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

import { useGetProjectInviteCode } from "../../../../api/hooks/useGetProjectInviteCode";
export const InviteMember = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? parseInt(id, 10) : null;
  const { data } = useGetProjectInviteCode(projectId);

  const inviteLink = `https://seamless.com/invite/${data?.resultData}`;

  const { onCopy, value, setValue, hasCopied } = useClipboard("");
  useEffect(() => {
    setValue(inviteLink);
  }, [inviteLink, setValue]);
  return (
    <Flex width="100%" flexDirection="column" gap={3}>
      <Heading as="h4" size="md">
        팀원 초대
      </Heading>
      <Text>아래 링크를 공유하여 팀원을 초대해 보세요.</Text>
      <InputGroup>
        <Input
          value={value}
          bgColor="#F6F6F6"
          color="#5A5A5A"
          border="transparent"
          pr="50px"
          readOnly
        />
        <IconButton
          position="absolute"
          onClick={onCopy}
          bgColor="transparent"
          color="#95A4FC"
          right="5px"
          top="50%"
          zIndex={10}
          transform="translateY(-50%)"
          size="sm"
          fontSize={18}
          icon={hasCopied ? <CheckIcon /> : <CopyIcon />}
          aria-label="Copy link"
        />
      </InputGroup>
    </Flex>
  );
};
