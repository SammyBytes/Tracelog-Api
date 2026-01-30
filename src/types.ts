import type { SelectAccount } from "@db/types";
import type { Session, User } from "better-auth";

export type Variables = {
  user: User;
  session: Session;
  projectId: string;
};
