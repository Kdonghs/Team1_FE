import { setupWorker } from "msw";

import { projectMockHandler } from "../api/hooks/projectDetail.mock";
import { teamProgressMockHandler } from "../api/hooks/teamProgress.mock";

export const worker = setupWorker(
  ...teamProgressMockHandler,
  ...projectMockHandler
);
