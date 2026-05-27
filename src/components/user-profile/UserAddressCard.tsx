"use client";

import CompanyProfileEditButton from "@/components/company-profile/CompanyProfileEditButton";
import FormModal from "@/components/prochauffeur/FormModal";
import {
  ModalFormDescription,
  ModalFormFooterActions,
} from "@/components/prochauffeur/modalShell";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useModal } from "@/hooks/useModal";
import React from "react";

export default function UserAddressCard() {
  const { isOpen, openModal, closeModal } = useModal();

  function handleSave() {
    closeModal();
  }

  return (
    <>
      <div className="rounded-2xl border border-gray-200 p-5 dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-6">
              Address
            </h4>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Street
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  123 Fleet Street
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  City
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  Phoenix
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  State
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  Arizona
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Postcode
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  85001
                </p>
              </div>

              <div>
                <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
                  Country
                </p>
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  United States
                </p>
              </div>
            </div>
          </div>

          <div className="self-end lg:self-auto">
            <CompanyProfileEditButton onClick={openModal} />
          </div>
        </div>
      </div>

      <FormModal
        isOpen={isOpen}
        onClose={closeModal}
        title="Edit address"
        footer={
          <ModalFormFooterActions>
            <Button size="sm" variant="outline" onClick={closeModal}>
              Cancel
            </Button>
            <Button size="sm" onClick={handleSave}>
              Save changes
            </Button>
          </ModalFormFooterActions>
        }
      >
        <ModalFormDescription>
          Update your details to keep your profile up-to-date.
        </ModalFormDescription>
        <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
          <div>
            <Label>Street</Label>
            <Input type="text" defaultValue="123 Fleet Street" />
          </div>

          <div>
            <Label>City</Label>
            <Input type="text" defaultValue="Phoenix" />
          </div>

          <div>
            <Label>State</Label>
            <Input type="text" defaultValue="Arizona" />
          </div>

          <div>
            <Label>Postcode</Label>
            <Input type="text" defaultValue="85001" />
          </div>

          <div>
            <Label>Country</Label>
            <Input type="text" defaultValue="United States" />
          </div>
        </div>
      </FormModal>
    </>
  );
}
