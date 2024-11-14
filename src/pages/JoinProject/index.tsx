import { Box, Text, useToast, VStack } from "@chakra-ui/react";
import { useParams } from "react-router-dom";

import { Image } from "../../components/common/Image";
import { JoinInput } from "../../components/common/SearchInput/ProjectJoin";

// interface MemberData {
//   message: string;
//   name: string;
//   role: string;
//   email: string;
//   getattendURL: string;
//   id: number;
// }

export const JoinProjectPage = () => {
  const { projectId } = useParams();
  const toast = useToast();

  const handleJoinSuccess = () => {
    toast({
      title: "프로젝트 참여 성공",
      description: "초대 메일이 발송되었습니다.",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleJoinError = (error: Error) => {
    toast({
      title: "프로젝트 참여 실패",
      description: error.message || "잠시 후 다시 시도해주세요.",
      status: "error",
      duration: 3000,
      isClosable: true,
    });
  };

  return (
    <VStack spacing={150} align="stretch">
      <Box maxW="md" mx="auto" mt={50}>
        <Image
          src="https://i.ibb.co/0GknsbY/image.png"
          alt="image1"
          width={500}
          height={500}
          ratio={16 / 9}
        />
        <Text fontSize="2xl" fontWeight="bold" textAlign="center" mb={50}>
          [ 프로젝트 ] 팀에 참여해주세요!
        </Text>
        <JoinInput
          height={50}
          projectId={Number(projectId)}
          onJoinSuccess={handleJoinSuccess}
          onJoinError={handleJoinError}
        />
      </Box>
    </VStack>
  );
};

export default JoinProjectPage;