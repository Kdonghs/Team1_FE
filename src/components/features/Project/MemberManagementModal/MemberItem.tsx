import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useDisclosure,
} from "@chakra-ui/react";
import { Ellipsis } from "lucide-react";

import type { MemberResponseDTO } from "../../../../api/generated/data-contracts";
import { MemberDeleteModal } from "./MemberDeleteModal";
import { MemberProfile } from "./MemberProfile";
import { MemberUpdateModal } from "./MemberUpdateModal";

export const MemberItem = ({ ...member }: MemberResponseDTO) => {
  const {
    isOpen: isMemberUpdateModalOpen,
    onOpen: onMemberUpdateModalOpen,
    onClose: onMemberUpdateModalClose,
  } = useDisclosure();

  const {
    isOpen: isMemberDeleteModalOpen,
    onOpen: onMemberDeleteModalOpen,
    onClose: onMemberDeleteModalClose,
  } = useDisclosure();

  return (
    <Flex
      width="100%"
      alignItems="center"
      justifyContent="space-between"
      _hover={{ backgroundColor: "#F6F6F6", borderRadius: "0.375rem" }}
      height="60px"
      transition="background-color 0.2s"
      p={2}
      py={8}
    >
      <MemberProfile {...member} />
      <Menu>
        <MenuButton
          as={IconButton}
          bgColor="transparent"
          aria-label="More member options"
          icon={<Ellipsis color="#5A5A5A" />}
          size="sm"
          m={1}
        />
        <MenuList
          minW="120px"
          boxShadow="md"
          border="1px solid"
          borderColor="gray.100"
          zIndex={10}
        >
          <MenuItem
            textAlign="center"
            icon={<EditIcon />}
            onClick={onMemberUpdateModalOpen}
          >
            정보 수정
          </MenuItem>

          <MemberUpdateModal
            isOpen={isMemberUpdateModalOpen}
            onClose={onMemberUpdateModalClose}
            {...member}
          />
          <MenuItem
            textAlign="center"
            icon={<DeleteIcon />}
            onClick={onMemberDeleteModalOpen}
            _hover={{ color: "red.500" }}
          >
            팀원 삭제
          </MenuItem>
        </MenuList>
      </Menu>

      <MemberDeleteModal
        isOpen={isMemberDeleteModalOpen}
        onClose={onMemberDeleteModalClose}
        {...member}
      />
    </Flex>
  );
};
