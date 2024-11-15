import { Container, Stack } from "@chakra-ui/react";
import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { useGetProjectDetail } from "../../api/hooks/project.api";
import { Project } from "../../components/features/Project";
import { KanbanBoard } from "../../components/features/Project/KanbanBoard";
import { ProgressAccordion } from "../../components/features/Project/ProgressAccordion";

export const ProjectKanbanPage = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? parseInt(id, 10) : 0;
  const navigate = useNavigate();

  const { data, error, isLoading } = useGetProjectDetail(projectId);

  useEffect(() => {
    if (!projectId || projectId <= 0) {
      navigate("/");
      return;
    }
  }, [projectId, navigate]);

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
            <KanbanBoard projectId={projectId} />
          </Stack>
        )}
      </Container>
    </>
  );
};
