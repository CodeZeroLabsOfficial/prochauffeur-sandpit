"use client";

import SettingsEditableCard from "@/components/company-profile/SettingsEditableCard";
import {
  displayValue,
  trimmedCompanyProfile,
} from "@/components/company-profile/displayValue";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import FormModal from "@/components/prochauffeur/FormModal";
import {
  ModalFormDescription,
  ModalFormFooterActions,
} from "@/components/prochauffeur/modalShell";
import Button from "@/components/ui/button/Button";
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
    const ok = await saveCompany(
      trimmedCompanyProfile({
        ...companyProfile,
        address,
      })
    );
    if (ok) closeModal();
  }

  return (
    <>
      <SettingsEditableCard onEdit={openModal} editAriaLabel="Edit company address">
        <h4 className="pe-10 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
          Company address
        </h4>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
          <div className="lg:col-span-2">
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Company address
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {displayValue(companyProfile.address)}
            </p>
          </div>
        </div>
      </SettingsEditableCard>

      <FormModal
        isOpen={isOpen}
        onClose={closeModal}
        title="Edit company address"
        footer={
          <ModalFormFooterActions>
            <Button
              size="sm"
              variant="outline"
              onClick={closeModal}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button size="sm" disabled={isSaving} onClick={() => void handleSave()}>
              {isSaving ? "Saving…" : "Save changes"}
            </Button>
          </ModalFormFooterActions>
        }
      >
        <ModalFormDescription>
          Update your company address to keep your profile up-to-date.
        </ModalFormDescription>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            void handleSave();
          }}
        >
          <div className="grid grid-cols-1 gap-x-6 gap-y-5">
            <div>
              <Label>Company address</Label>
              <Input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
        </form>
      </FormModal>
    </>
  );
}
