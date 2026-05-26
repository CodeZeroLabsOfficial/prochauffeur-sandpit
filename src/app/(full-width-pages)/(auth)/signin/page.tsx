import SignInForm from "@/components/auth/SignInForm";
import { Suspense } from "react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign in | ProChauffeur Dispatch",
  description: "Fleet administrator sign in for the ProChauffeur dispatch console.",
};

export default function SignIn() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-gray-400">Loading…</div>}>
      <SignInForm />
    </Suspense>
  );
}
