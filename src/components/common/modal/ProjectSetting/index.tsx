import {
  Button,
  ButtonGroup,
  FormControl,
  FormLabel,
  Input,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import styled from "@emotion/styled";

export const ProjectSettingModal = ({ onClose }: { onClose: () => void }) => {
  return (
    <>
      <ModalOverlay />
      <StyledModalContent>
        <ModalHeader fontSize={26} fontWeight={800} pb={10}>
          프로젝트 설정
        </ModalHeader>
        <ModalCloseButton m={3} />
        <ModalBody>
          <Stack spacing={4} display="flex">
            <FormControl display="flex" alignItems="center" gap={3}>
              <FormLabel
                minWidth="25%"
                m="0"
                color="#727272"
                fontSize={18}
                fontWeight={800}
              >
                프로젝트명
              </FormLabel>
              <Input
                height="50px"
                border="#E3E3E3 solid 1.3px"
                focusBorderColor="#95A4FC"
                type="text"
              />
            </FormControl>
            <FormControl display="flex" alignItems="center" gap={3}>
              <FormLabel
                minWidth="25%"
                m="0"
                color="#727272"
                fontSize={18}
                fontWeight={800}
              >
                시작일
              </FormLabel>
              <Input
                height="50px"
                border="#E3E3E3 solid 1.3px"
                focusBorderColor="#95A4FC"
                type="date"
              />
            </FormControl>
            <FormControl display="flex" alignItems="center" gap={3}>
              <FormLabel
                minWidth="25%"
                m="0"
                color="#727272"
                fontSize={18}
                fontWeight={800}
              >
                종료일
              </FormLabel>
              <Input
                height="50px"
                border="#E3E3E3 solid 1.3px"
                focusBorderColor="#95A4FC"
                type="date"
              />
            </FormControl>

            <FormControl display="flex" alignItems="center" gap={3}>
              <FormLabel
                minWidth="25%"
                m="0"
                color="#727272"
                fontSize={18}
                fontWeight={800}
              >
                기능 설정
              </FormLabel>
              <ButtonGroup variant="outline" width="100%">
                <StyledButton flex="1">기본</StyledButton>
                <StyledButton flex="1">사용자 설정</StyledButton>
              </ButtonGroup>
            </FormControl>
          </Stack>
          <Spacer height={100} />
        </ModalBody>

        <ModalFooter>
          <StyledButton onClick={onClose}>수정</StyledButton>
        </ModalFooter>
      </StyledModalContent>
    </>
  );
};

const StyledModalContent = styled(ModalContent)`
  border-radius: 16.23px;
  padding: 0.5em;
`;

const StyledButton = styled(Button)`
  width: 134px;
  height: 50px;
  padding: 4px 8px; /* px, py */
  background-color: #95a4fc;
  color: white;
`;
