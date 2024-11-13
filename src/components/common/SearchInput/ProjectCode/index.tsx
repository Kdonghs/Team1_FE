import { Button } from "@chakra-ui/react";
import styled from "@emotion/styled";
import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";

import { RouterPath } from "../../../../routes/path";
import { authSessionStorage } from "../../../../utils/storage";

interface AuthResponse {
  errorCode: number;
  errorMessage: string;
  resultData: {
    token: string;
    projectId: string;
    user: {
      id: number;
      name: string;
      email: string;
      role: string;
    };
  };
}

interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onError'> {
  onError?: (error: Error) => void;
}

const validateCode = (code: string): boolean => {
  const trimmedCode = code.trim();
  return trimmedCode.length > 0;
};

const authenticateWithCode = async (memberCode: string): Promise<AuthResponse> => {
  const response = await fetch(`/api/auth/memberCode?memberCode=${encodeURIComponent(memberCode)}`, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data?.errorMessage || "인증에 실패했습니다.");
  }

  return data;
};

export const SearchInput: React.FC<SearchInputProps> = ({
  onError,
  ...inputProps
}) => {
  const [memberCode, setMemberCode] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setMemberCode(value);
    setIsValid(validateCode(value));
  }, []);

  const handleAuth = useCallback(async () => {
    if (!isValid || isLoading) return;

    setIsLoading(true);
    try {
      const response = await authenticateWithCode(memberCode);

      if (response.errorCode === 0 && response.resultData?.token) {
        authSessionStorage.set(response.resultData.token);
        navigate(`${RouterPath.project}/${response.resultData.projectId}`);
      } else {
        throw new Error(response.errorMessage || "인증에 실패했습니다.");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      onError?.(error instanceof Error ? error : new Error("인증 중 오류가 발생했습니다."));
    } finally {
      setIsLoading(false);
    }
  }, [memberCode, isValid, isLoading, navigate, onError]);

  const handleKeyPress = useCallback((e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isValid && !isLoading) {
      handleAuth();
    }
  }, [handleAuth, isValid, isLoading]);

  return (
    <Container>
      <StyledInput
        value={memberCode}
        onChange={handleInputChange}
        onKeyPress={handleKeyPress}
        placeholder="인증 코드를 입력해주세요."
        disabled={isLoading}
        {...inputProps}
      />
      <AuthButton
        onClick={handleAuth}
        isDisabled={!isValid || isLoading}
        isLoading={isLoading}
      >
        참여하기
      </AuthButton>
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
  padding: 0 1rem;
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: 13.86px;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: #7b7ff6;
    box-shadow: 0 0 0 1px #7b7ff6;
  }

  &::placeholder {
    color: #a0aec0;
  }

  &:disabled {
    background-color: #f7fafc;
    cursor: not-allowed;
  }
`;

const AuthButton = styled(Button)`
  width: 120px;
  height: 40px;
  margin-top: 16px;
  border-radius: 8px;
  background-color: ${props => props.isDisabled ? "#E2E8F0" : "#7B7FF6"};
  color: white;

  &:hover:not(:disabled) {
    background-color: #6972F0;
  }

  &:active:not(:disabled) {
    background-color: #5A63E6;
  }

  &:disabled {
    background-color: #E2E8F0;
    cursor: not-allowed;
    opacity: 1;
  }
`;

export default SearchInput;