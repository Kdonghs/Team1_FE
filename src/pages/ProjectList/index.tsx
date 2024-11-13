import { AddIcon, ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  IconButton,
  Modal,
  ModalContent,
  ModalOverlay,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import React, { useState } from "react";

// import { useGetProjects } from "../../api/hooks/useGetProjects";
import { ProjectCreatingModal } from "../../components/common/modal/ProjectCreate";
import { ScheduleList } from "../../components/common/ScheduleCard";
import { SearchInput } from "../../components/common/SearchInput/ProjectCode";
import { ProjectCard } from "../../components/features/Home/ProjectCard";
import type { Project, ProjectData } from "../../types";

const initialMockProjects: Project[] = [
  {
    id: 1,
    name: "AI 챗봇 개발 프로젝트",
    description: "고객 서비스 향상을 위한 AI 기반 챗봇 시스템 개발",
    imageUrl: "https://example.com/chatbot.jpg",
    startDate: "2024-01-15T07:13:35.717Z",
    endDate: "2024-06-15T07:13:35.717Z",
    optionIds: [1, 2],
  },
  {
    id: 2,
    name: "모바일 앱 리뉴얼",
    description: "기존 모바일 앱의 UI/UX 개선 및 신규 기능 추가",
    imageUrl: "https://example.com/mobile-app.jpg",
    startDate: "2024-02-01T07:13:35.717Z",
    endDate: "2024-07-31T07:13:35.717Z",
    optionIds: [1, 2, 3],
  },
  {
    id: 3,
    name: "데이터 분석 플랫폼",
    description: "실시간 데이터 분석 및 시각화 플랫폼 구축",
    imageUrl: "https://example.com/data-analytics.jpg",
    startDate: "2024-03-01T07:13:35.717Z",
    endDate: "2024-09-30T07:13:35.717Z",
    optionIds: [1, 2],
  },
];

const handleJoinSuccess = (projectId: number, guestId: number) => {
  console.log(`Successfully joined project ${projectId} as guest ${guestId}`);
};

export const ProjectListPage: React.FC = () => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [startIndex, setStartIndex] = useState(0);

  // const { data: projects = [] } = useGetProjects();

  // 임시 코드
  const [projects, setProjects] = useState<Project[]>(initialMockProjects);

  const projectsPerView = 4;
  const visibleProjects = projects.slice(
    startIndex,
    startIndex + projectsPerView,
  );

  const shouldShowNavigation = projects.length > projectsPerView;
  const canGoPrevious = startIndex > 0;
  const canGoNext = startIndex + projectsPerView < projects.length;

  const handlePrevious = () => {
    if (canGoPrevious) {
      setStartIndex((prev) => Math.max(0, prev - 1));
    }
  };

  const handleNext = () => {
    if (canGoNext) {
      setStartIndex((prev) =>
        Math.min(projects.length - projectsPerView, prev + 1),
      );
    }
  };

  const handleAddProject = (newProjectData: ProjectData) => {
    const newProject: Project = {
      id: projects.length + 1,
      name: newProjectData.name,
      description: newProjectData.description,
      imageUrl: newProjectData.imageURL,
      startDate: newProjectData.startDate,
      endDate: newProjectData.endDate,
      optionIds: newProjectData.optionIds,
    };

    setProjects((prevProjects) => [...prevProjects, newProject]);
  };

  const handleModalClose = () => {
    onClose();
    setStartIndex(0);
  };

  return (
    <Box>
      <Box maxW="lg" mx="auto">
        <SearchInput
          placeholder="# 참여코드로 시작"
          onJoinSuccess={handleJoinSuccess}
          height={50}
          width={50}
        />
      </Box>

      <Box mt={10}>
        <Flex alignItems="center" justifyContent="center" gap="800">
          <Text fontSize="20px" fontWeight="bold" mb={6}>
            프로젝트
          </Text>
          <Button
            backgroundColor="#95A4FC"
            color="#FFFFFF"
            onClick={onOpen}
            leftIcon={<AddIcon />}
          >
            생성
          </Button>
        </Flex>

        <Flex justifyContent="center" alignItems="center" gap={6} p={5}>
          {shouldShowNavigation && (
            <IconButton
              aria-label="Previous projects"
              icon={<ChevronLeftIcon />}
              onClick={handlePrevious}
              isDisabled={!canGoPrevious}
            />
          )}

          <Flex gap={6}>
          {visibleProjects.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}  // id prop 추가
                title={project.name}
                startDate={project.startDate}
                endDate={project.endDate}
                option={{
                  type: project.optionIds.length === 2 ? "basic" : "custom",
                }}
                imageSrc={project.imageUrl}  // 이미지 URL 추가
              />
            ))}
          </Flex>

          {shouldShowNavigation && (
            <IconButton
              aria-label="Next projects"
              icon={<ChevronRightIcon />}
              onClick={handleNext}
              isDisabled={!canGoNext}
            />
          )}
        </Flex>

        <Modal isOpen={isOpen} onClose={handleModalClose} size="md" isCentered>
          <ModalOverlay />
          <ModalContent>
            <ProjectCreatingModal
              onClose={handleModalClose}
              onProjectCreated={handleAddProject}
            />
          </ModalContent>
        </Modal>
      </Box>

      <Box maxW="1010" mx="auto" mb={10}>
        <ScheduleList />
      </Box>
    </Box>
  );
};

export default ProjectListPage;

// ProjectCreatingModal.tsx
