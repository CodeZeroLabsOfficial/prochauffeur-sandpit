"use client";

import Checkbox from "@/components/form/input/Checkbox";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useAuth } from "@/context/AuthContext";
import { ChevronLeftIcon, EyeCloseIcon, EyeIcon } from "@/icons";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function SignInForm() {
  const { signIn, loading, isAdmin, error, clearError } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isChecked, setIsChecked] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && isAdmin) {
      router.replace(searchParams.get("next") ?? "/");
    }
  }, [isAdmin, loading, router, searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    clearError();
    setLocalError(null);
    setSubmitting(true);
    try {
      await signIn(email, password);
      router.replace(searchParams.get("next") ?? "/");
    } catch (err) {
      setLocalError(
        err instanceof Error ? err.message : "Sign in failed. Try again."
      );
    } finally {
      setSubmitting(false);
    }
  }

  const message = localError ?? error;

  return (
    <div className="flex flex-col flex-1 lg:w-1/2 w-full">
      <div className="w-full max-w-md sm:pt-10 mx-auto mb-5">
        <Link
          href="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon />
          Back to dashboard
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              ProChauffeur Dispatch
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Sign in with your fleet administrator account.
            </p>
          </div>

          {message ? (
            <div className="mb-4 rounded-xl border border-error-500/30 bg-error-500/10 px-4 py-3 text-sm text-error-500">
              {message}
            </div>
          ) : null}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <Label>
                  Email <span className="text-error-500">*</span>
                </Label>
                <Input
                  placeholder="admin@yourfleet.com"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <Label>
                  Password <span className="text-error-500">*</span>
                </Label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute z-30 -translate-y-1/2 cursor-pointer right-4 top-1/2"
                  >
                    {showPassword ? (
                      <EyeIcon className="fill-gray-500 dark:fill-gray-400" />
                    ) : (
                      <EyeCloseIcon className="fill-gray-500 dark:fill-gray-400" />
                    )}
                  </button>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Checkbox checked={isChecked} onChange={setIsChecked} />
                <span className="block font-normal text-gray-700 text-theme-sm dark:text-gray-400">
                  Keep me logged in
                </span>
              </div>
              <div>
                <Button
                  className="w-full"
                  size="sm"
                  type="submit"
                  disabled={submitting || loading}
                >
                  {submitting ? "Signing in…" : "Sign in"}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
