export const APP_NAME = "ProChauffeur Dispatch";

export function pageTitle(segment: string): string {
  return `${segment} | ${APP_NAME}`;
}

export type StubConfig = {
  breadcrumb: string;
  title: string;
  description: string;
  phase?: string;
  priority?: string;
  iosEquivalent?: string;
  firestore?: string;
  tailAdminBase?: string;
};
