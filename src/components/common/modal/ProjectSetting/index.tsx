import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  VStack,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import type { ProjectDetail } from "@/api/generated/data-contracts";

import { Project as ProjectApi } from "../../../../api/generated/Project";
import { SwitchField } from "../../Fields/switchField";
import { AnimatedPageTransition } from "./animatedPageTransition";
import { ProjectDetailSettingFields } from "./ProjectSettingForm/projectDetailSettingFields";
import { renderFooterButtons } from "./renderFooterButtons";

export const ProjectSettingModal = ({ onClose }: { onClose: () => void }) => {
  const [projectDetail, setProjectDetail] = useState<ProjectDetail | null>(
    null
  );
  const projectId = useParams().id;
  const [error, setError] = useState<string | null>(null);

  const methods = useForm<ProjectDetail>();

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

  useEffect(() => {
    const fetchProjectData = async () => {
      const projectApi = new ProjectApi();
      try {
        if (projectId) {
          const response = await projectApi.getProject(parseInt(projectId));
          const fetchedData = response.data.resultData;

          if (fetchedData) {
            setProjectDetail(fetchedData);
            methods.reset({
              name: fetchedData.name,
              startDate: fetchedData.startDate
                ? fetchedData.startDate.slice(0, 16)
                : undefined,
              endDate: fetchedData.endDate
                ? fetchedData.endDate.slice(0, 16)
                : undefined,
            });
          }
        }
      } catch (err) {
        setError("Failed to fetch project data");
      }
    };

    fetchProjectData();
  }, [projectId, methods]);

  if (error) {
    return <div>{error}</div>;
  }
  if (!projectDetail) {
    return <div>Loading...</div>;
  }

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
              <FormProvider {...methods}>
                <ProjectDetailSettingFields
                  selectedFeature={selectedFeature}
                  setSelectedFeature={setSelectedFeature}
                  projectDetail={projectDetail}
                />
              </FormProvider>
              <Spacer height={50} />
            </ModalBody>
          ) : (
            <ModalBody>
              <VStack spacing={6}>
                <SwitchField
                  title="진행률에 따른 나무 성장!"
                  description="진행률이 오를수록 나무가 성장해요."
                  id="treeGrowth"
                />
                <SwitchField
                  title="진행률에 따른 빵빠레!"
                  description="진행률이 50% 달성될 때 메인 화면에 빵빠레가 울려요!"
                  id="celebration"
                />
                <SwitchField
                  title="마감 기한에 따른 색 변화!"
                  description="마감 기한이 1일 남았을 때 아이콘이 빨간색으로 바뀌어요!"
                  id="colorChange"
                />
                <SwitchField
                  title="이메일 전송!"
                  description="마감기한이 3일 남았을 때 하루 간격으로 이메일이 전송돼요!"
                  id="emailSend"
                />
              </VStack>
              <Spacer height="14px" />
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
