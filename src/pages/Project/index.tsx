import { Container, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";

import { useGetProjectDetail } from "../../api/hooks/useGetProjectDetail";
import { Project } from "../../components/features/Project";
import { KanbanBoard } from "../../components/features/Project/KanbanBoard";
import { ProgressAccordion } from "../../components/features/Project/ProgressAccordion";
import { ProgressTracker } from "../../components/features/Project/ProgressTracker";

const override: React.CSSProperties = {
  display: "block",
  margin: "0 auto",
  borderColor: "#95A4FC",
  borderWidth: "10px",
};

export const ProjectPage = () => {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? parseInt(id, 10) : null;
  const navigate = useNavigate();
  const { data, error } = useGetProjectDetail(projectId);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (!projectId || projectId <= 0) {
      navigate("/");
      return;
    }
  }, [projectId, navigate]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 800);

    return () => clearTimeout(timer);
  }, []);

  if (error) {
    console.log(error);
  }

  const isKanbanView = location.hash === "#kanban";

  return (
    <>
      <Project />
      <Container maxW="container.xl" padding={6}>
        {data?.id !== undefined && (
          <Stack spacing={6}>
            <ProgressAccordion projectDetail={data} />
            {isKanbanView ? (
              <KanbanBoard projectId={data.id} />
            ) : (
              <ProgressTracker projectId={data.id} />
            )}
          </Stack>
        )}

        {loading && (
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              backgroundColor: "white",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 9999,
            }}
          >
            <ClipLoader
              loading={loading}
              cssOverride={override}
              size={150}
              aria-label="Loading Spinner"
              data-testid="loader"
            />
          </div>
        )}
      </Container>
    </>
  );
};
