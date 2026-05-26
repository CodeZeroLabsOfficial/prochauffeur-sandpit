"use client";

import { useAdminDashboard } from "@/context/AdminDashboardContext";
import { displayNameForUser, formatSummaryDateTime } from "@/lib/prochauffeur/display";
import React from "react";

export default function AdminAccountDetails({ userId }: { userId: string }) {
  const { userById } = useAdminDashboard();
  const admin = userById.get(userId);

  if (!admin) {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Administrator not found.
      </p>
    );
  }

  if (admin.role !== "admin") {
    return (
      <p className="text-sm text-gray-500 dark:text-gray-400">
        This user is not an administrator.
      </p>
    );
  }

  return (
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">
        Administrator account
      </p>

      <dl className="mt-6 space-y-4 text-sm">
        <div>
          <dt className="text-gray-500 dark:text-gray-400">Name</dt>
          <dd className="mt-1 text-gray-800 dark:text-white/90">
            {displayNameForUser(admin, admin.id)}
          </dd>
        </div>
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
    </div>
  );
}
