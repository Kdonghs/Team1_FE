import {
  Button,
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
import { useState } from "react";

import { DateField } from "../../Fields/dateField";
import { TextField } from "../../Fields/textField";
import { ToggleButtonGroup } from "./toggleButtonGroup";

export const ProjectSettingModal = ({ onClose }: { onClose: () => void }) => {
  const [selectedFeature, setSelectedFeature] = useState("기본");

  return (
    <>
      <ModalOverlay />
      <StyledModalContent>
        <ModalHeader fontSize={26} fontWeight={800} pb={10}>
          프로젝트 설정
        </ModalHeader>
        <ModalCloseButton m={5} />
        <ModalBody>
          <Stack spacing={4} display="flex">
            <TextField label="프로젝트명" />
            <DateField label="시작일" />
            <DateField label="종료일" />

            <ToggleButtonGroup
              label="기능 설정"
              options={["기본", "사용자 설정"]}
              selectedOption={selectedFeature}
              onChange={setSelectedFeature}
            />
          </Stack>
          <Spacer height={100} />
        </ModalBody>

        <ModalFooter>
          <StyledButton onClick={onClose} width={"134px"}>
            수정
          </StyledButton>
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
  height: 50px;
  padding: 4px 8px;
  background-color: #95a4fc;
  color: white;
`;
