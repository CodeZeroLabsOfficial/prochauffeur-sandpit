import { StubPage, stubMetadata, stubs, type StubKey } from "@/lib/prochauffeur/stubs";
import type { Metadata } from "next";
import type { ReactElement } from "react";

export function createStaticStubPage(key: StubKey): {
  metadata: Metadata;
  Page: () => ReactElement;
} {
  const config = stubs[key];
  return {
    metadata: stubMetadata(config),
    Page: function Page() {
      return <StubPage {...config} />;
    },
  };
}
