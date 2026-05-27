"use client";

import AdminActionBanner from "@/components/prochauffeur/AdminActionBanner";
import FormModal from "@/components/prochauffeur/FormModal";
import {
  ModalFormFooterActions,
  ModalFormFooterSplit,
} from "@/components/prochauffeur/modalShell";
import Input from "@/components/form/input/InputField";
import Label from "@/components/form/Label";
import Button from "@/components/ui/button/Button";
import { useAdminOperations } from "@/context/AdminOperationsContext";
import { forwardGeocodeFirstCoordinate } from "@/lib/prochauffeur/mapboxGeocode";
import type { FleetLocation } from "@/lib/prochauffeur/types";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

type LocationFormViewProps = {
  locationId?: string;
  variant?: "page" | "modal";
  isOpen?: boolean;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export default function LocationFormView({
  locationId,
  variant = "page",
  isOpen = false,
  onSuccess,
  onCancel,
}: LocationFormViewProps) {
  const router = useRouter();
  const isModal = variant === "modal";
  const {
    locations,
    createLocation,
    saveLocation,
    removeLocation,
    isSaving,
    actionError,
    clearActionError,
  } = useAdminOperations();
  const isNew = !locationId;

  const [name, setName] = useState("");
  const [addressLine, setAddressLine] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isGeocoding, setIsGeocoding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!locationId) return;
    const existing = locations.find((l) => l.id === locationId);
    if (!existing) return;
    setName(existing.name);
    setAddressLine(existing.addressLine);
    setLatitude(existing.latitude);
    setLongitude(existing.longitude);
  }, [locationId, locations]);

  async function geocodeAddress() {
    setLocalError(null);
    setIsGeocoding(true);
    try {
      const query = [name.trim(), addressLine.trim()].filter(Boolean).join(", ");
      const result = await forwardGeocodeFirstCoordinate(query);
      setLatitude(result.latitude);
      setLongitude(result.longitude);
    } catch (e) {
      setLocalError(
        e instanceof Error ? e.message : "Could not geocode that address."
      );
    } finally {
      setIsGeocoding(false);
    }
  }

  async function handleSave() {
    if (!name.trim() || !addressLine.trim()) {
      setLocalError("Name and address are required.");
      return;
    }
    if (latitude == null || longitude == null) {
      setLocalError("Geocode the address before saving.");
      return;
    }

    setLocalError(null);

    if (isNew) {
      const id = await createLocation({
        name: name.trim(),
        addressLine: addressLine.trim(),
        latitude,
        longitude,
      });
      if (!id) return;
      if (onSuccess) {
        onSuccess();
        return;
      }
      router.push("/company#locations");
      return;
    }

    const payload: FleetLocation = {
      id: locationId!,
      name: name.trim(),
      addressLine: addressLine.trim(),
      latitude,
      longitude,
      createdAt:
        locations.find((l) => l.id === locationId)?.createdAt ?? new Date(),
    };
    const ok = await saveLocation(payload);
    if (!ok) return;
    if (onSuccess) {
      onSuccess();
      return;
    }
    router.push("/company#locations");
  }

  async function handleDelete() {
    if (!locationId) return;
    const ok = await removeLocation(locationId);
    if (!ok) return;
    if (onSuccess) {
      onSuccess();
      return;
    }
    router.push("/company#locations");
  }

  function handleCancel() {
    if (onCancel) {
      onCancel();
      return;
    }
    router.push("/company#locations");
  }

  const fields = (
    <div className={isModal ? "space-y-5" : "max-w-2xl space-y-5"}>
      <div>
        <Label>Location name</Label>
        <Input value={name} onChange={(e) => setName(e.target.value)} />
      </div>
      <div>
        <Label>Address</Label>
        <Input
          value={addressLine}
          onChange={(e) => setAddressLine(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          disabled={isGeocoding || !addressLine.trim()}
          onClick={geocodeAddress}
        >
          {isGeocoding ? "Geocoding…" : "Look up on map"}
        </Button>
        {latitude != null && longitude != null ? (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {latitude.toFixed(5)}, {longitude.toFixed(5)}
          </span>
        ) : (
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Coordinates required before save
          </span>
        )}
      </div>
    </div>
  );

  const deleteActions =
    !isNew ? (
      !confirmDelete ? (
        <Button
          className="!bg-error-500 hover:!bg-error-600"
          size="sm"
          disabled={isSaving}
          onClick={() => setConfirmDelete(true)}
        >
          Delete location
        </Button>
      ) : (
        <>
          <Button
            className="!bg-error-500 hover:!bg-error-600"
            size="sm"
            disabled={isSaving}
            onClick={handleDelete}
          >
            Confirm delete
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={isSaving}
            onClick={() => setConfirmDelete(false)}
          >
            Cancel delete
          </Button>
        </>
      )
    ) : null;

  const footer = (
    <ModalFormFooterSplit
      left={deleteActions}
      right={
        <ModalFormFooterActions>
          <Button
            size="sm"
            variant="outline"
            disabled={isSaving}
            onClick={handleCancel}
          >
            Cancel
          </Button>
          <Button
            size="sm"
            disabled={isSaving || confirmDelete}
            onClick={handleSave}
          >
            {isSaving ? "Saving…" : "Save location"}
          </Button>
        </ModalFormFooterActions>
      }
    />
  );

  if (isModal) {
    return (
      <FormModal
        isOpen={isOpen}
        onClose={handleCancel}
        title={isNew ? "Add location" : "Edit location"}
        footer={footer}
        footerAlign="between"
        size="md"
      >
        {(actionError || localError) && (
          <AdminActionBanner
            message={localError ?? actionError ?? ""}
            onDismiss={() => {
              setLocalError(null);
              clearActionError();
            }}
          />
        )}
        {fields}
      </FormModal>
    );
  }

  return (
    <>
      {(actionError || localError) && (
        <AdminActionBanner
          message={localError ?? actionError ?? ""}
          onDismiss={() => {
            setLocalError(null);
            clearActionError();
          }}
        />
      )}
      <div className="max-w-2xl pt-2">{footer}</div>
    </>
  );
}
