import { setupServer } from "msw/node";

import { projectMockHandler } from "@/api/hooks/projectDetail.mock";

import { teamProgressMockHandler } from "../api/hooks/teamProgress.mock";

export const server = setupServer(
  ...teamProgressMockHandler,
  ...projectMockHandler
);
