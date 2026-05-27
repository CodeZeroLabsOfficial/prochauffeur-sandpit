"use client";

import FormModal from "@/components/prochauffeur/FormModal";
import {
  ModalFormDescription,
  ModalFormFooterActions,
} from "@/components/prochauffeur/modalShell";
import ProfilePicturePicker from "@/components/user-profile/ProfilePicturePicker";
import { splitDisplayName } from "@/components/user-profile/profileDisplay";
import { useAuth } from "@/context/AuthContext";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { ensureFirebaseInitialized, getFirebaseAuth } from "@/lib/firebase/client";
import { updateUserProfileAndEmail } from "@/lib/prochauffeur/firestore";
import { updateEmail } from "firebase/auth";
import React, { useEffect, useState } from "react";

type EditPersonalInformationModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function EditPersonalInformationModal({
  isOpen,
  onClose,
}: EditPersonalInformationModalProps) {
  const { appUser, refreshAppUser } = useAuth();

  const displayName =
    appUser?.profile.displayName.trim() || appUser?.email || "Administrator";
  const { firstName: initialFirst, lastName: initialLast } =
    splitDisplayName(displayName);

  const [photoURL, setPhotoURL] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [bio, setBio] = useState("Fleet Administrator");
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isOpen) return;
    setPhotoURL(appUser?.profile.photoURL?.trim() ?? "");
    setFirstName(initialFirst);
    setLastName(initialLast);
    setEmail(appUser?.email ?? "");
    setPhone(appUser?.profile.phoneNumber?.trim() ?? "");
    setBio("Fleet Administrator");
    setSaveError(null);
  }, [isOpen, appUser, initialFirst, initialLast]);

  async function handleSave() {
    if (!appUser) return;

    const nextEmail = email.trim();
    if (!nextEmail) {
      setSaveError("Email address is required.");
      return;
    }

    const nextDisplayName = `${firstName.trim()} ${lastName.trim()}`.trim();
    if (!nextDisplayName) {
      setSaveError("Enter at least a first name or last name.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    try {
      await ensureFirebaseInitialized();
      const auth = getFirebaseAuth();
      const currentUser = auth.currentUser;
      const currentEmail = currentUser?.email?.trim() ?? "";

      if (currentUser && nextEmail !== currentEmail) {
        await updateEmail(currentUser, nextEmail);
      }

      await updateUserProfileAndEmail(
        appUser.id,
        {
          ...appUser.profile,
          displayName: nextDisplayName,
          phoneNumber: phone.trim() || null,
          photoURL: photoURL.trim() || null,
        },
        nextEmail
      );

      await refreshAppUser();
      onClose();
    } catch (error) {
      setSaveError(
        error instanceof Error
          ? error.message
          : "Could not save your profile details."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <FormModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit personal information"
      size="lg"
      footer={
        <ModalFormFooterActions>
          <Button size="sm" variant="outline" type="button" onClick={onClose}>
            Cancel
          </Button>
          <Button size="sm" onClick={() => void handleSave()} disabled={isSaving}>
            {isSaving ? "Saving..." : "Save changes"}
          </Button>
        </ModalFormFooterActions>
      }
    >
      <ModalFormDescription>
        Update your details to keep your profile up-to-date.
      </ModalFormDescription>
      {saveError ? (
        <p className="mb-4 text-sm text-error-500">{saveError}</p>
      ) : null}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          void handleSave();
        }}
      >
        <ProfilePicturePicker
          photoURL={photoURL}
          displayName={displayName}
          onPhotoChange={setPhotoURL}
        />

        <div className="mt-7">
          <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90">
            Personal information
          </h5>

          <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
            <div className="col-span-2 lg:col-span-1">
              <Label>First name</Label>
              <Input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>

            <div className="col-span-2 lg:col-span-1">
              <Label>Last name</Label>
              <Input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
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
              <Label>Bio</Label>
              <Input
                type="text"
                value={bio}
                onChange={(e) => setBio(e.target.value)}
              />
            </div>
          </div>
        </div>
      </form>
    </FormModal>
  );
}
