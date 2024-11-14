import { ArrowForwardIcon } from "@chakra-ui/icons";
import {
  IconButton,
  InputGroup,
  InputRightElement,
  useToast
} from "@chakra-ui/react";
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

interface SearchInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "onError"> {
  onError?: (error: Error) => void;
}

const validateCode = (code: string): boolean => {
  const trimmedCode = code.trim();
  return trimmedCode.length > 0;
};

const authenticateWithCode = async (
  memberCode: string,
): Promise<AuthResponse> => {
  const response = await fetch(
    `/api/auth/memberCode?memberCode=${encodeURIComponent(memberCode)}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
      },
    },
  );

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
  const toast = useToast();

  const handleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setMemberCode(value);
      setIsValid(validateCode(value));
    },
    [],
  );

  const handleAuth = useCallback(async () => {
    if (!isValid || isLoading) return;

    setIsLoading(true);
    try {
      const response = await authenticateWithCode(memberCode);

      if (response.errorCode === 0 && response.resultData?.token) {
        authSessionStorage.set(response.resultData.token);
        toast({
          title: "인증 성공",
          description: "프로젝트로 이동합니다.",
          status: "success",
          duration: 3000,
          isClosable: true
        });
        navigate(`${RouterPath.project}/${response.resultData.projectId}`);
      } else {
        throw new Error(response.errorMessage || "인증에 실패했습니다.");
      }
    } catch (error) {
      console.error("Authentication error:", error);
      const errorMessage = error instanceof Error ? error.message : "인증 중 오류가 발생했습니다.";

      toast({
        title: "인증 실패",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true
      });

      onError?.(
        error instanceof Error
          ? error
          : new Error(errorMessage),
      );
    } finally {
      setIsLoading(false);
    }
  }, [memberCode, isValid, isLoading, navigate, onError, toast]);


  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && isValid && !isLoading) {
        handleAuth();
      }
    },
    [handleAuth, isValid, isLoading],
  );

  return (
    <Container>
      <StyledInputGroup>
        <StyledInput
          value={memberCode}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="인증 코드를 입력해주세요."
          disabled={isLoading}
          {...inputProps}
        />
        <StyledInputRightElement>
          <IconButton
            onClick={handleAuth}
            isDisabled={!isValid || isLoading}
            isLoading={isLoading}
            icon={<ArrowForwardIcon />}
            aria-label="Join Project"
            variant="ghost"
            color={isValid && !isLoading ? "#7B7FF6" : "gray.300"}
            _hover={{
              bg: "transparent",
              color: "#6972F0",
            }}
            _active={{
              bg: "transparent",
              color: "#5A63E6",
            }}
          />
        </StyledInputRightElement>

      </StyledInputGroup>
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
`;

const StyledInputGroup = styled(InputGroup)`
  align-items: center;
  width: 100%;
  height: auto;
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
const StyledInputRightElement = styled(InputRightElement)`
  height: 100%;
  width: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export default SearchInput;