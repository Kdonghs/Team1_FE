import {
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
} from "@chakra-ui/react";
import styled from "@emotion/styled";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useParams } from "react-router-dom";

import type { ProjectDetail } from "@/api/generated/data-contracts";

import { useGetProjectDetail } from "../../../../api/hooks/useGetProjectDetail";
import { ProjectOptionSettingFields } from "../ProjectSetting/ProjectSettingForm/projectOptionSettingFields";
import { AnimatedPageTransition } from "./animatedPageTransition";
import { ProjectDetailSettingFields } from "./ProjectSettingForm/projectDetailSettingFields";
import { renderFooterButtons } from "./renderFooterButtons";

const DEFAULT_FEATURE = "기본";

export const ProjectSettingModal = ({ onClose }: { onClose: () => void }) => {
  const { id } = useParams<{ id: string }>();
  const projectId = id ? parseInt(id, 10) : null;

  const methods = useForm<ProjectDetail>();

  // TODO: 향후 기본 상태에 대한 논의 필요
  const [selectedFeature, setSelectedFeature] = useState(DEFAULT_FEATURE);
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

  const { data, error, isLoading } = useGetProjectDetail(projectId);

  useEffect(() => {
    if (data) {
      methods.reset({
        name: data.name,
        startDate: data.startDate ? data.startDate.slice(0, 16) : "",
        endDate: data.endDate ? data.endDate.slice(0, 16) : "",
        optionIds: data.optionIds,
      });
    }
  }, [data, methods]);

  if (error) {
    return <div>{error.message}</div>;
  }
  if (isLoading) {
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
                />
              </FormProvider>
              <Spacer height={50} />
            </ModalBody>
          ) : (
            <ModalBody>
              <FormProvider {...methods}>
                <ProjectOptionSettingFields />
              </FormProvider>
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
