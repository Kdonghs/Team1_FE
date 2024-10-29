import {
  Button,
  Flex,
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
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { DateField } from "../../Fields/dateField";
import { TextField } from "../../Fields/textField";
import { ToggleButtonGroup } from "./toggleButtonGroup";

const variants = {
  entry: (back: boolean) => ({
    x: back ? -300 : 300,
    opacity: 0,
  }),
  center: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.3 },
  },
  exit: (back: boolean) => ({
    x: back ? 300 : -300,
    opacity: 0,
  }),
};

const renderFooterButtons = (
  currentPage: number,
  selectedFeature: string,
  onClose: () => void,
  handleNextPage: () => void,
  handlePreviousPage: () => void
) => {
  if (currentPage === 1) {
    if (selectedFeature === "기본") {
      return (
        <StyledButton onClick={onClose} width={"134px"}>
          저장
        </StyledButton>
      );
    } else {
      return (
        <StyledButton onClick={handleNextPage} width={"134px"}>
          다음
        </StyledButton>
      );
    }
  } else {
    return (
      <Flex justifyContent="space-between" width={"100%"}>
        <StyledButton onClick={handlePreviousPage} width={"134px"} mr={2}>
          이전
        </StyledButton>
        <StyledButton onClick={onClose} width={"134px"}>
          저장
        </StyledButton>
      </Flex>
    );
  }
};

export const ProjectSettingModal = ({ onClose }: { onClose: () => void }) => {
  // 기본값 설정
  const [selectedFeature, setSelectedFeature] = useState("기본");
  const [currentPage, setCurrentPage] = useState(1); // 페이지 상태
  const [back, setBack] = useState(false);

  const handleNextPage = () => {
    setCurrentPage(2);
    setBack(false);
  };

  const handlePreviousPage = () => {
    setCurrentPage(1);
    setBack(true);
  };

  return (
    <>
      <ModalOverlay />
      <StyledModalContent>
        <ModalHeader fontSize={26} fontWeight={800} pb={10}>
          프로젝트 설정
        </ModalHeader>
        <ModalCloseButton m={5} />

        <AnimatePresence mode="wait" custom={back} initial={false}>
          <motion.div
            key={currentPage}
            initial="entry"
            animate="center"
            exit="exit"
            variants={variants}
            transition={{ duration: 0.3 }}
            custom={back}
          >
            {currentPage === 1 ? (
              <ModalBody>
                <Stack spacing={4}>
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
                <Spacer height={50} />
              </ModalBody>
            ) : (
              <ModalBody>
                <div>두 번째 페이지</div>
              </ModalBody>
            )}
          </motion.div>
        </AnimatePresence>

        <ModalFooter>
          {renderFooterButtons(
            currentPage,
            selectedFeature,
            onClose,
            handleNextPage,
            handlePreviousPage
          )}
        </ModalFooter>
      </StyledModalContent>
    </>
  );
};

const StyledModalContent = styled(ModalContent)`
  border-radius: 16.23px;
  padding: 0.5em;
  overflow: hidden;
`;

const StyledButton = styled(Button)`
  height: 50px;
  padding: 4px 8px;
  background-color: #95a4fc;
  color: white;
`;
