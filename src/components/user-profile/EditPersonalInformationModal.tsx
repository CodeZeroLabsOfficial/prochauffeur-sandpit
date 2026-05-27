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
import React, { useEffect, useState } from "react";

type EditPersonalInformationModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onSave?: () => void;
};

export default function EditPersonalInformationModal({
  isOpen,
  onClose,
  onSave,
}: EditPersonalInformationModalProps) {
  const { appUser } = useAuth();

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

  useEffect(() => {
    if (!isOpen) return;
    setPhotoURL(appUser?.profile.photoURL?.trim() ?? "");
    setFirstName(initialFirst);
    setLastName(initialLast);
    setEmail(appUser?.email ?? "");
    setPhone(appUser?.profile.phoneNumber?.trim() ?? "");
    setBio("Fleet Administrator");
  }, [isOpen, appUser, initialFirst, initialLast]);

  function handleSave() {
    onSave?.();
    onClose();
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
          <Button size="sm" onClick={handleSave}>
            Save changes
          </Button>
        </ModalFormFooterActions>
      }
    >
      <ModalFormDescription>
        Update your details to keep your profile up-to-date.
      </ModalFormDescription>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
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
