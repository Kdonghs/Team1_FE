import { Container, Stack, useToast } from "@chakra-ui/react";
import dayjs from "dayjs";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useGetProjectDetail } from "../../api/hooks/project.api";
import { Project } from "../../components/features/Project";
import { ProgressAccordion } from "../../components/features/Project/ProgressAccordion";
import { ProgressTracker } from "../../components/features/Project/ProgressTracker";

export const ProjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? parseInt(id, 10) : null;
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetProjectDetail(projectId);
  const toast = useToast();

  useEffect(() => {
    if (!projectId || projectId <= 0) {
      navigate("/");
      return;
    }
  }, [projectId, navigate]);

  useEffect(() => {
    if (!dayjs(data?.endDate).isAfter(dayjs())) {
      toast({
        title: "종료된 프로젝트입니다.",
        description: "일부 기능이 제한될 수 있습니다.",
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    }
  }, [data, toast]);

  if (error) {
    console.log(error);
  }

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <Project />
      <Container maxW="container.xl" padding={6}>
        {data?.id !== undefined && (
          <Stack spacing={6}>
            <ProgressAccordion projectDetail={data} />
            <ProgressTracker projectId={data.id} />
          </Stack>
        )}
      </Container>
    </>
  );
};
