"use client";

import CompanyProfileEditButton from "@/components/company-profile/CompanyProfileEditButton";
import { displayValue } from "@/components/company-profile/displayValue";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { Modal } from "@/components/ui/modal";
import { useAdminOperations } from "@/context/AdminOperationsContext";
import { useModal } from "@/hooks/useModal";
import React, { useEffect, useState } from "react";

export default function CompanyAddressCard() {
  const { companyProfile, saveCompany, isSaving } = useAdminOperations();
  const { isOpen, openModal, closeModal } = useModal();
  const [address, setAddress] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setAddress(companyProfile.address);
  }, [isOpen, companyProfile.address]);

  async function handleSave() {
    const ok = await saveCompany({
      displayName: companyProfile.displayName.trim(),
      address: address.trim(),
      phone: companyProfile.phone.trim(),
      email: companyProfile.email.trim(),
      bio: companyProfile.bio.trim(),
      logoURL: companyProfile.logoURL.trim(),
    });
    if (ok) closeModal();
  }

  return (
    <>
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
            Address
          </h4>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div className="lg:col-span-2">
              <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                Business address
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                {displayValue(companyProfile.address)}
              </p>
            </div>
          </div>
        </div>

        <div className="self-end lg:self-start">
          <CompanyProfileEditButton onClick={openModal} />
        </div>
      </div>

      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="relative w-full overflow-y-auto rounded-3xl bg-white p-4 no-scrollbar dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Edit address
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Update your company address to keep your profile up-to-date.
            </p>
          </div>
          <form
            className="flex flex-col"
            onSubmit={(e) => {
              e.preventDefault();
              void handleSave();
            }}
          >
            <div className="custom-scrollbar overflow-y-auto px-2">
              <div className="grid grid-cols-1 gap-x-6 gap-y-5">
                <div>
                  <Label>Business address</Label>
                  <Input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
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
