import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Select,
  VStack,
} from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import type { MemberResponseDTO } from "@/api/generated/data-contracts";

import { useGetProjectMembers } from "../../../api/hooks/project.api";

interface SelectFieldProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  isInvalid?: boolean;
  errorMessage?: string;
}

export const SelectProjectMemberField = ({
  label,
  value,
  onChange,
  isInvalid,
  errorMessage,
}: SelectFieldProps) => {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? parseInt(id, 10) : 0;

  const {
    data: membersData,
    error: membersError,
    isLoading: membersLoading,
  } = useGetProjectMembers(projectId, 0, "name");

  if (membersLoading) {
    return <div>로딩 중</div>;
  }

  if (membersError) {
    return <div>팀원 목록을 불러올 수 없습니다.</div>;
  }

  const members = membersData?.pages[0].resultData as MemberResponseDTO[];

  return (
    <FormControl
      display="flex"
      alignItems="center"
      gap={3}
      isInvalid={isInvalid}
    >
      <FormLabel
        as="legend"
        minWidth="25%"
        m="0"
        color="#727272"
        fontSize={18}
        height="50px"
        fontWeight={800}
      >
        {label}
      </FormLabel>
      <VStack width="100%" height="70px">
        <Select
          value={value}
          onChange={(e) => onChange(parseInt(e.target.value, 10))}
          height="50px"
          color="#727272"
          border="#E3E3E3 solid 1.3px"
        >
          <option value="">선택</option>
          {members.map((member: MemberResponseDTO) => (
            <option key={member.id} value={member.id}>
              {member.name}
            </option>
          ))}
        </Select>
        {errorMessage && (
          <FormErrorMessage
            m={-1}
            fontSize={"13px"}
            width="100%"
            textAlign="left"
          >
            {errorMessage}
          </FormErrorMessage>
        )}
      </VStack>
    </FormControl>
  );
};
