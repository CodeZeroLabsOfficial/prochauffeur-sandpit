"use client";

import CompanyProfileEditButton from "@/components/company-profile/CompanyProfileEditButton";
import { displayValue } from "@/components/company-profile/displayValue";
import Input from "@/components/form/input/InputField";
import TextArea from "@/components/form/input/TextArea";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useAdminOperations } from "@/context/AdminOperationsContext";
import { useModal } from "@/hooks/useModal";
import Image from "next/image";
import React, { useEffect, useState } from "react";

function companyInitials(name: string): string {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return `${words[0][0]}${words[1][0]}`.toUpperCase();
}

export default function CompanyDetailsCard() {
  const { companyProfile, saveCompany, isSaving } = useAdminOperations();
  const { isOpen, openModal, closeModal } = useModal();

  const [displayName, setDisplayName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [logoURL, setLogoURL] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setDisplayName(companyProfile.displayName);
    setPhone(companyProfile.phone);
    setEmail(companyProfile.email);
    setBio(companyProfile.bio);
    setLogoURL(companyProfile.logoURL);
  }, [isOpen, companyProfile]);

  const name = displayValue(companyProfile.displayName, "Your company");
  const subtitle = [companyProfile.phone, companyProfile.email]
    .map((value) => value.trim())
    .filter(Boolean)
    .join(" · ");
  const location = companyProfile.address.trim();

  async function handleSave() {
    const ok = await saveCompany({
      displayName: displayName.trim(),
      address: companyProfile.address.trim(),
      phone: phone.trim(),
      email: email.trim(),
      bio: bio.trim(),
      logoURL: logoURL.trim(),
    });
    if (ok) closeModal();
  }

  return (
    <>
      <div>
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-full border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-gray-800">
              {companyProfile.logoURL.trim() ? (
                <Image
                  width={80}
                  height={80}
                  src={companyProfile.logoURL}
                  alt={`${name} logo`}
                  className="h-full w-full object-cover"
                  unoptimized
                />
              ) : (
                <span className="text-xl font-semibold text-gray-500 dark:text-gray-400">
                  {companyInitials(name)}
                </span>
              )}
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-center text-lg font-semibold text-gray-800 dark:text-white/90 xl:text-left">
                {name}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                {subtitle ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    {subtitle}
                  </p>
                ) : (
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Add contact details
                  </p>
                )}
                {location ? (
                  <>
                    <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {location}
                    </p>
                  </>
                ) : null}
              </div>
            </div>
          </div>
          <div className="self-end xl:self-auto">
            <CompanyProfileEditButton onClick={openModal} />
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:grid-cols-4 2xl:gap-x-32">
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Company / fleet name
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {displayValue(companyProfile.displayName)}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Email address
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {displayValue(companyProfile.email)}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Phone
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {displayValue(companyProfile.phone)}
            </p>
          </div>

          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Public bio
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {displayValue(companyProfile.bio)}
            </p>
          </div>
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="no-scrollbar relative w-full max-w-[700px] overflow-y-auto rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit company information
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your company details to keep your profile up-to-date.
            </p>
          </div>
          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              void handleSave();
            }}
          >
            <div className="custom-scrollbar max-h-[450px] overflow-y-auto px-2 pb-3">
              <div>
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Company logo
                </h5>
                <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                  <div>
                    <Label>Logo image URL</Label>
                    <Input
                      type="text"
                      value={logoURL}
                      onChange={(e) => setLogoURL(e.target.value)}
                      placeholder="https://example.com/logo.png"
                    />
                  </div>
                </div>
              </div>
              <div className="mt-7">
                <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
                  Company information
                </h5>

                <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
                  <div className="col-span-2 lg:col-span-1">
                    <Label>Company / fleet name</Label>
                    <Input
                      type="text"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Email address</Label>
                    <Input
                      type="text"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="col-span-2 lg:col-span-1">
                    <Label>Phone</Label>
                    <Input
                      type="text"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                    />
                  </div>

                  <div className="col-span-2">
                    <Label>Public bio</Label>
                    <TextArea rows={4} value={bio} onChange={setBio} />
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 flex items-center gap-3 px-2 lg:justify-end">
              <Button
                size="sm"
                variant="outline"
                onClick={closeModal}
                disabled={isSaving}
              >
                Close
              </Button>
              <Button size="sm" disabled={isSaving} onClick={handleSave}>
                {isSaving ? "Saving…" : "Save Changes"}
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </>
  );
}
