"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import Link from "next/link";
import React from "react";

export default function AddDriverNoticeView() {
  return (
    <div>
      <PageBreadcrumb pageTitle="Add driver" />

      <div className="max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Driver provisioning requires a Cloud Function
        </h2>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          The iOS admin app creates driver Auth accounts through a backend
          callable (similar to `deleteDriverAuth`). The web console can manage
          existing drivers, profiles, and vehicle assignments, but adding a new
          driver still needs that provisioning endpoint wired up.
        </p>
        <p className="mt-3 text-sm text-gray-600 dark:text-gray-300">
          For now, add drivers from the iOS admin app or Firebase Console, then
          manage them here once their users document exists with role driver.
        </p>
        <Link href="/drivers" className="mt-6 inline-block">
          <Button variant="outline" size="sm">
            Back to drivers
          </Button>
        </Link>
      </div>
    </div>
  );
}
