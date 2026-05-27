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

type AddressFields = {
  street: string;
  city: string;
  state: string;
  postcode: string;
  country: string;
};

function parseAddress(address: string): AddressFields {
  const parts = address
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean);

  return {
    street: parts[0] ?? "",
    city: parts[1] ?? "",
    state: parts[2] ?? "",
    postcode: parts[3] ?? "",
    country: parts[4] ?? "",
  };
}

function formatAddress(fields: AddressFields): string {
  return [
    fields.street.trim(),
    fields.city.trim(),
    fields.state.trim(),
    fields.postcode.trim(),
    fields.country.trim(),
  ]
    .filter(Boolean)
    .join(", ");
}

export default function CompanyAddressCard() {
  const { companyProfile, saveCompany, isSaving } = useAdminOperations();
  const { isOpen, openModal, closeModal } = useModal();
  const parsedAddress = parseAddress(companyProfile.address);
  const [street, setStreet] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [postcode, setPostcode] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    const parsed = parseAddress(companyProfile.address);
    setStreet(parsed.street);
    setCity(parsed.city);
    setState(parsed.state);
    setPostcode(parsed.postcode);
    setCountry(parsed.country);
  }, [isOpen, companyProfile.address]);

  async function handleSave() {
    const address = formatAddress({
      street,
      city,
      state,
      postcode,
      country,
    });
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
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Street
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {displayValue(parsedAddress.street)}
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              City
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {displayValue(parsedAddress.city)}
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              State
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {displayValue(parsedAddress.state)}
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Postcode
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {displayValue(parsedAddress.postcode)}
            </p>
          </div>
          <div>
            <p className="mb-2 text-xs leading-normal text-gray-500 dark:text-gray-400">
              Country
            </p>
            <p className="text-sm font-medium text-gray-800 dark:text-white/90">
              {displayValue(parsedAddress.country)}
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
          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div>
              <Label>Street</Label>
              <Input
                type="text"
                value={street}
                onChange={(e) => setStreet(e.target.value)}
              />
            </div>
            <div>
              <Label>City</Label>
              <Input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />
            </div>
            <div>
              <Label>State</Label>
              <Input
                type="text"
                value={state}
                onChange={(e) => setState(e.target.value)}
              />
            </div>
            <div>
              <Label>Postcode</Label>
              <Input
                type="text"
                value={postcode}
                onChange={(e) => setPostcode(e.target.value)}
              />
            </div>
            <div>
              <Label>Country</Label>
              <Input
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
          </div>
        </form>
      </FormModal>
    </>
  );
}
