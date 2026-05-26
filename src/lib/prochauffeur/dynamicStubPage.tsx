import { StubPage, stubMetadata, stubs, type StubKey } from "@/lib/prochauffeur/stubs";

type DynamicStubPageProps = {
  stubKey: StubKey;
  routeParams: Record<string, string>;
};

export function DynamicStubPage({ stubKey, routeParams }: DynamicStubPageProps) {
  const config = stubs[stubKey];
  return <StubPage {...config} routeParams={routeParams} />;
}

export function dynamicStubMetadata(stubKey: StubKey) {
  return stubMetadata(stubs[stubKey]);
}
