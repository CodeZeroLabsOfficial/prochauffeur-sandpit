"use client";

import { useAuth } from "@/context/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect } from "react";

export default function AdminAuthGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const { loading, isAdmin } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (loading) return;
    if (!isAdmin) {
      router.replace(`/signin?next=${encodeURIComponent(pathname)}`);
    }
  }, [isAdmin, loading, pathname, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <p className="text-sm text-gray-400">Loading dispatch console…</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900">
        <p className="text-sm text-gray-400">Redirecting to sign in…</p>
      </div>
    );
  }

  return <>{children}</>;
}
