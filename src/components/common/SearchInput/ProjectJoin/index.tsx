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

const validateUrl = (url: string): boolean => {
  return url.trim().length > 0;
};

interface InviteResponse {
  errorCode: number;
  errorMessage: string;
  resultData: string;
}

interface MemberResponse {
  errorCode: number;
  errorMessage: string;
  resultData: {
    message: string;
    name: string;
    role: string;
    email: string;
    getattendURL: string;
    id: number;
  };
}

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  projectId: number;
  onJoinSuccess?: (member: MemberResponse["resultData"]) => void;
  onJoinError?: (error: Error) => void;
}

interface FormData {
  email: string;
  name: string;
  attendURL: string;
}

interface FormValidity {
  email: boolean;
  name: boolean;
  attendURL: boolean;
}

const createMember = async (
  email: string,
  name: string,
  attendURL: string
): Promise<MemberResponse> => {
  try {
    const response = await fetch(`/api/project/1/member`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        name,
        attendURL,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      throw new Error(errorData?.errorMessage || "멤버 생성에 실패했습니다.");
    }

    const data: MemberResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Create Member API Error:", error);
    throw error;
  }
};

const sendInvite = async (
  projectId: number,
  email: string,
  name: string
): Promise<InviteResponse> => {
  try {
    const response = await fetch(`/api/project/invite`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

    const data: InviteResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Invite API Error:", error);
    throw error;
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
    attendURL: "",
  });

  const [validity, setValidity] = useState<FormValidity>({
    email: false,
    name: false,
    attendURL: false,
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
        [name]:
          name === "email"
            ? validateEmail(value)
            : name === "name"
            ? validateName(value)
            : validateUrl(value),
      }));
    },
    []
  );

  const isFormValid = validity.email && validity.name && validity.attendURL;

  const handleJoin = useCallback(async () => {
    if (!isFormValid || isLoading) return;

    setIsLoading(true);
    try {
      const memberResponse = await createMember(
        formData.email,
        formData.name,
        formData.attendURL
      );

      if (memberResponse.errorCode === 200 && memberResponse.resultData) {
        try {
          await sendInvite(projectId, formData.email, formData.name);
        } catch (inviteError) {
          console.warn("Invite API error (email sent successfully):", inviteError);
        }

        onJoinSuccess?.(memberResponse.resultData);
        setFormData({ email: "", name: "", attendURL: "" });
        setValidity({ email: false, name: false, attendURL: false });
      } else {
        throw new Error(memberResponse.errorMessage || "멤버 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("Error in join process:", error);
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
      <StyledInput
        name="attendURL"
        value={formData.attendURL}
        onChange={handleInputChange}
        placeholder="참석 URL을 입력해주세요."
        type="text"
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