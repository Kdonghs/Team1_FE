import {
  Button,
  Container,
  Flex,
  Modal,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";

import { ProjectSettingModal } from "../../common/modal/ProjectSetting/";
import { MemberManagementModal } from "./MemberManagementModal";

export const Project = () => {
  const {
    isOpen: isMemberManagementModalOpen,
    onOpen: onMemberManagementModalOpen,
    onClose: onMemberManagementModalClose,
  } = useDisclosure();

  const {
    isOpen: isProjectSettingModalOpen,
    onOpen: onProjectSettingModalOpen,
    onClose: onProjectSettingModalClose,
  } = useDisclosure();

  const buttonWidth = useBreakpointValue({
    base: "100%",
    sm: "48%",
    md: "48%",
    lg: "auto",
  });

  return (
    <Container maxW="container.xl" p={5}>
      <Flex justifyContent="space-between" alignItems="center" py={6}>
        <Text fontSize="5xl" fontWeight="bold">
          Project
        </Text>
        {/* TODO: 관리자만 보이도록 권한 설정 필요 */}
        <Flex
          direction={{ base: "column", sm: "row" }}
          alignItems="stretch"
          justifyContent="flex-end"
          gap={4}
          wrap="wrap"
          m={2}
        >
          <Button
            {...buttonStyle}
            onClick={onMemberManagementModalOpen}
            w={buttonWidth}
            fontSize={"md"}
          >
            팀원 관리
          </Button>
          <Modal
            isOpen={isMemberManagementModalOpen}
            onClose={onMemberManagementModalClose}
            size={"md"}
            isCentered
          >
            <MemberManagementModal />
          </Modal>
          <Button
            {...buttonStyle}
            onClick={onProjectSettingModalOpen}
            w={buttonWidth}
            fontSize={"md"}
          >
            프로젝트 설정
          </Button>
          <Modal
            isOpen={isProjectSettingModalOpen}
            onClose={onProjectSettingModalClose}
            size={"md"}
            isCentered
          >
            <ProjectSettingModal onClose={onProjectSettingModalClose} />
          </Modal>
        </Flex>
      </Flex>
    </Container>
  );
};

const buttonStyle = {
  size: "lg",
  px: 8,
  py: 4,
  height: "auto",
  backgroundColor: "#95A4FC",
  color: "white",
};
