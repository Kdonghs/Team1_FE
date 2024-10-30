import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Stack,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import type { ProjectDetail } from "@/api/generated/data-contracts";

import { Project as ProjectApi } from "../../../../api/generated/Project";
import { DateField } from "../../Fields/dateField";
import { TextField } from "../../Fields/textField";
import { AnimatedPageTransition } from "./animatedPageTransition";
import { renderFooterButtons } from "./renderFooterButtons";
import { ToggleButtonGroup } from "./toggleButtonGroup";

export const ProjectSettingModal = ({ onClose }: { onClose: () => void }) => {
  const projectId = useParams().id;
  const [projectData, setProjectData] = useState<ProjectDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProjectData = async () => {
      const projectApi = new ProjectApi();
      try {
        if (projectId) {
          const response = await projectApi.getProject(parseInt(projectId));
          setProjectData(response.data.resultData || null);
        }
      } catch (err) {
        setError("Failed to fetch project data");
      }
    };

    fetchProjectData();
  }, [projectId]);

  useEffect(() => {
    if (projectData) {
      setProjectName(projectData.name || "");
      setStartDate(
        projectData.startDate ? new Date(projectData.startDate) : null
      );
      setEndDate(projectData.endDate ? new Date(projectData.endDate) : null);
    }
  }, [projectData]);

  if (error) navigate("/");

  const [projectName, setProjectName] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [selectedFeature, setSelectedFeature] = useState("기본");
  const [currentPage, setCurrentPage] = useState(1);
  const [back, setBack] = useState(false);

  const handleNextPage = () => {
    setCurrentPage(2);
    setBack(false);
  };

  const handlePreviousPage = () => {
    setCurrentPage(1);
    setBack(true);
  };
  return (
    <>
      <ModalOverlay />
      <StyledModalContent>
        <ModalHeader fontSize={26} fontWeight={800} pb={10}>
          프로젝트 설정
        </ModalHeader>
        <ModalCloseButton m={5} />

        <AnimatedPageTransition currentPage={currentPage} back={back}>
          {currentPage === 1 ? (
            <ModalBody>
              <Stack spacing={4}>
                <TextField
                  label="프로젝트명"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                />
                <DateField
                  label="시작일"
                  selectedDate={startDate}
                  onChange={setStartDate}
                />
                <DateField
                  label="종료일"
                  selectedDate={endDate}
                  onChange={setEndDate}
                />
                <ToggleButtonGroup
                  label="기능 설정"
                  options={["기본", "사용자 설정"]}
                  selectedOption={selectedFeature}
                  onChange={setSelectedFeature}
                />
              </Stack>
              <Spacer height={50} />
            </ModalBody>
          ) : (
            <ModalBody>
              <div>두 번째 페이지</div>
            </ModalBody>
          )}
        </AnimatedPageTransition>

        <ModalFooter>
          {renderFooterButtons(
            currentPage,
            selectedFeature,
            onClose,
            handleNextPage,
            handlePreviousPage
          )}
        </ModalFooter>
      </StyledModalContent>
    </>
  );
};

const StyledModalContent = styled(ModalContent)`
  border-radius: 16.23px;
  padding: 0.5em;
  overflow: hidden;
`;
