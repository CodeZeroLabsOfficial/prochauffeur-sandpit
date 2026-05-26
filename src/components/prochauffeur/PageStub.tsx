import React from "react";
import Badge from "@/components/ui/badge/Badge";

export type PageStubProps = {
  title: string;
  description: string;
  phase?: string;
  priority?: string;
  iosEquivalent?: string;
  firestore?: string;
  tailAdminBase?: string;
  routeParams?: Record<string, string>;
  children?: React.ReactNode;
};

export default function PageStub({
  title,
  description,
  phase,
  priority,
  iosEquivalent,
  firestore,
  tailAdminBase,
  routeParams,
  children,
}: PageStubProps) {
  return (
    <div className="min-h-[480px] rounded-2xl border border-gray-200 bg-white px-5 py-7 dark:border-gray-800 dark:bg-white/[0.03] xl:px-10 xl:py-12">
      <div className="mx-auto w-full max-w-3xl">
        <div className="mb-6 flex flex-wrap items-center gap-2">
          {phase ? (
            <Badge variant="light" color="primary">
              {phase}
            </Badge>
          ) : null}
          {priority ? (
            <Badge variant="light" color="warning">
              {priority}
            </Badge>
          ) : null}
        </div>

        <h3 className="mb-3 font-semibold text-gray-800 text-theme-xl dark:text-white/90 sm:text-2xl">
          {title}
        </h3>
        <p className="mb-8 text-sm text-gray-500 dark:text-gray-400 sm:text-base">
          {description}
        </p>

        {routeParams && Object.keys(routeParams).length > 0 ? (
          <div className="mb-8 rounded-xl border border-gray-200 bg-gray-50 p-4 dark:border-gray-800 dark:bg-white/[0.02]">
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
              Route parameters
            </p>
            <dl className="grid gap-2 sm:grid-cols-2">
              {Object.entries(routeParams).map(([key, value]) => (
                <div key={key}>
                  <dt className="text-xs text-gray-500 dark:text-gray-400">{key}</dt>
                  <dd className="font-mono text-sm text-gray-800 dark:text-white/90">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        ) : null}

        <dl className="grid gap-4 sm:grid-cols-2">
          {iosEquivalent ? (
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <dt className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                iOS equivalent
              </dt>
              <dd className="font-mono text-sm text-gray-800 dark:text-white/90">
                {iosEquivalent}
              </dd>
            </div>
          ) : null}
          {firestore ? (
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800">
              <dt className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                Firestore
              </dt>
              <dd className="font-mono text-sm text-gray-800 dark:text-white/90">
                {firestore}
              </dd>
            </div>
          ) : null}
          {tailAdminBase ? (
            <div className="rounded-xl border border-gray-200 p-4 dark:border-gray-800 sm:col-span-2">
              <dt className="mb-1 text-xs font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400">
                TailAdmin starting point
              </dt>
              <dd className="text-sm text-gray-800 dark:text-white/90">{tailAdminBase}</dd>
            </div>
          ) : null}
        </dl>

        {children ? <div className="mt-8">{children}</div> : null}
      </div>
    </div>
  );
}
