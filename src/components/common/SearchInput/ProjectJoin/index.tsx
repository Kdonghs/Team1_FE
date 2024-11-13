import { Button } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React, { useCallback, useState } from "react";

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

interface JoinResponse {
  errorCode: number;
  errorMessage: string;
  resultData: string;
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  projectId: number;
  onJoinSuccess?: (projectId: number, guestId: number) => void;
  onJoinError?: (error: Error) => void;
}

interface FormData {
  email: string;
  name: string;
}

interface FormValidity {
  email: boolean;
  name: boolean;
}
const inviteToProject = async (
  projectId: number,
  email: string,
  name: string,
): Promise<JoinResponse> => {
  try {
    const response = await fetch("/api/project/invite", {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        projectId,
        email,
        name,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.errorMessage || "초대 발송에 실패했습니다.");
    }

    return await response.json();
  } catch (error) {
    console.error("Error sending invitation:", error);
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("초대 발송 중 오류가 발생했습니다.");
  }
};

export const JoinInput: React.FC<FormInputProps> = ({
  projectId,
  onJoinSuccess,
  onJoinError,
  ...props
}) => {
  const [formData, setFormData] = useState<FormData>({
    email: "",
    name: "",
  });

  const [validity, setValidity] = useState<FormValidity>({
    email: false,
    name: false,
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));

      setValidity((prev) => ({
        ...prev,
        [name]: name === "email" ? validateEmail(value) : validateName(value),
      }));
    },
    [],
  );

  const isFormValid = validity.email && validity.name;

  const handleJoin = useCallback(async () => {
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    try {
      const response = await inviteToProject(
        projectId,
        formData.email,
        formData.name,
      );

      if (response.errorCode === 0) {
        onJoinSuccess?.(projectId, Number(response.resultData));
        // 폼 초기화
        setFormData({ email: "", name: "" });
        setValidity({ email: false, name: false });
      } else {
        throw new Error(response.errorMessage);
      }
    } catch (error) {
      onJoinError?.(error as Error);
    } finally {
      setIsLoading(false);
    }
  }, [formData, isFormValid, projectId, onJoinSuccess, onJoinError, isLoading]);

  return (
    <Container>
      <StyledInput
        name="name"
        value={formData.name}
        onChange={handleInputChange}
        placeholder="이름을 입력해주세요."
        {...props}
      />
      <StyledInput
        name="email"
        value={formData.email}
        onChange={handleInputChange}
        placeholder="이메일 주소를 입력해주세요."
        type="email"
        {...props}
      />
      <Button
        onClick={handleJoin}
        isDisabled={!isFormValid || isLoading}
        isLoading={isLoading}
        width="120px"
        height="40px"
        mt="16px"
        bg={isFormValid ? "#7B7FF6" : "#E2E8F0"}
        color="white"
        _hover={{
          bg: isFormValid ? "#6972F0" : "#E2E8F0",
        }}
        _active={{
          bg: isFormValid ? "#5A63E6" : "#E2E8F0",
        }}
        _disabled={{
          bg: "#E2E8F0",
          cursor: "not-allowed",
          opacity: 1,
        }}
        borderRadius="8px"
      >
        참여하기
      </Button>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  gap: 16px;
`;

const StyledInput = styled.input`
  height: 3rem;
  width: 100%;
  padding-left: 1rem;
  padding-right: 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 13.86px;
  &:focus {
    outline: none;
    border-color: #7b7ff6;
    box-shadow: 0 0 0 1px #7b7ff6;
  }
  &::placeholder {
    color: #a0aec0;
  }
`;

export default JoinInput;
