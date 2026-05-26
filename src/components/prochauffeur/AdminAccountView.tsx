"use client";

import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Button from "@/components/ui/button/Button";
import { useAdminDashboard } from "@/context/AdminDashboardContext";
import { displayNameForUser, formatSummaryDateTime } from "@/lib/prochauffeur/display";
import Link from "next/link";
import React from "react";

export default function AdminAccountView({ userId }: { userId: string }) {
  const { userById } = useAdminDashboard();
  const admin = userById.get(userId);

  if (!admin) {
    return (
      <div>
        <PageBreadcrumb pageTitle="Administrator" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Administrator not found.
        </p>
      </div>
    );
  }

  if (admin.role !== "admin") {
    return (
      <div>
        <PageBreadcrumb pageTitle="Administrator" />
        <p className="text-sm text-gray-500 dark:text-gray-400">
          This user is not an administrator.
        </p>
        <Link href="/company/admins" className="mt-4 inline-block">
          <Button variant="outline" size="sm">
            Back to user management
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Administrator" />

      <div className="max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-white/90">
          {displayNameForUser(admin, admin.id)}
        </h2>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          Administrator account
        </p>

        <dl className="mt-6 space-y-4 text-sm">
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Email</dt>
            <dd className="mt-1 text-gray-800 dark:text-white/90">
              {admin.email}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Display name</dt>
            <dd className="mt-1 text-gray-800 dark:text-white/90">
              {admin.profile.displayName || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Phone</dt>
            <dd className="mt-1 text-gray-800 dark:text-white/90">
              {admin.profile.phoneNumber || "—"}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">Account created</dt>
            <dd className="mt-1 text-gray-800 dark:text-white/90">
              {formatSummaryDateTime(admin.createdAt)}
            </dd>
          </div>
          <div>
            <dt className="text-gray-500 dark:text-gray-400">User id</dt>
            <dd className="mt-1 font-mono text-xs text-gray-600 dark:text-gray-300">
              {admin.id}
            </dd>
          </div>
        </dl>

        <Link href="/company/admins" className="mt-6 inline-block">
          <Button variant="outline" size="sm">
            Back to user management
          </Button>
        </Link>
      </div>
    </div>
  );
}
