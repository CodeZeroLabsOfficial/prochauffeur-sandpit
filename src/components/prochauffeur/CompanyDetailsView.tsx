"use client";

import AdminActionBanner from "@/components/prochauffeur/AdminActionBanner";
import PageBreadcrumb from "@/components/common/PageBreadCrumb";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import TextArea from "@/components/form/input/TextArea";
import Button from "@/components/ui/button/Button";
import { useAdminOperations } from "@/context/AdminOperationsContext";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function CompanyDetailsView() {
  const router = useRouter();
  const { companyProfile, saveCompany, isSaving, actionError, clearActionError } =
    useAdminOperations();

  const [displayName, setDisplayName] = useState("");
  const [address, setAddress] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [bio, setBio] = useState("");
  const [logoURL, setLogoURL] = useState("");

  useEffect(() => {
    setDisplayName(companyProfile.displayName);
    setAddress(companyProfile.address);
    setPhone(companyProfile.phone);
    setEmail(companyProfile.email);
    setBio(companyProfile.bio);
    setLogoURL(companyProfile.logoURL);
  }, [companyProfile]);

  async function handleSave() {
    const ok = await saveCompany({
      displayName: displayName.trim(),
      address: address.trim(),
      phone: phone.trim(),
      email: email.trim(),
      bio: bio.trim(),
      logoURL: logoURL.trim(),
    });
    if (ok) router.push("/company");
  }

  return (
    <div>
      <PageBreadcrumb pageTitle="Company details" />

      {actionError ? (
        <AdminActionBanner message={actionError} onDismiss={clearActionError} />
      ) : null}

      <div className="max-w-2xl space-y-5 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-800 dark:bg-white/[0.03]">
        <Field label="Company / fleet name" value={displayName} onChange={setDisplayName} />
        <Field label="Address" value={address} onChange={setAddress} />
        <Field label="Phone" value={phone} onChange={setPhone} />
        <Field label="Email" value={email} onChange={setEmail} />
        <Field label="Logo image URL" value={logoURL} onChange={setLogoURL} />
        <div>
          <Label>Public bio</Label>
          <TextArea rows={4} value={bio} onChange={setBio} />
        </div>

        <div className="flex gap-3 pt-2">
          <Button disabled={isSaving} onClick={handleSave}>
            {isSaving ? "Saving…" : "Save details"}
          </Button>
          <Button variant="outline" disabled={isSaving} onClick={() => router.push("/company")}>
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}
