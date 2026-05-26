"use client";

import TripStatusBadge from "@/components/prochauffeur/TripStatusBadge";
import { useAdminDashboard } from "@/context/AdminDashboardContext";
import { getMapboxToken } from "@/lib/firebase/config";
import { isUpcomingTripStatus } from "@/lib/prochauffeur/types";
import type { Trip } from "@/lib/prochauffeur/types";
import Link from "next/link";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import React, { useEffect, useMemo, useRef, useState } from "react";

function tripMarkerColor(status: Trip["status"]): string {
  switch (status) {
    case "requested":
      return "#F79009";
    case "accepted":
      return "#465FFF";
    case "en_route_pickup":
    case "in_progress":
      return "#12B76A";
    default:
      return "#667085";
  }
}

export default function DispatchMapView() {
  const vm = useAdminDashboard();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);

  const activeTrips = useMemo(
    () => vm.trips.filter((t) => isUpcomingTripStatus(t.status)),
    [vm.trips]
  );

  const selectedTrip =
    activeTrips.find((t) => t.id === selectedTripId) ?? activeTrips[0] ?? null;

  useEffect(() => {
    if (!selectedTripId && activeTrips[0]) {
      setSelectedTripId(activeTrips[0].id);
    }
  }, [activeTrips, selectedTripId]);

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) return;

    mapboxgl.accessToken = getMapboxToken();
    const first = activeTrips[0];
    const center: [number, number] = first
      ? [first.pickup.longitude, first.pickup.latitude]
      : [151.2093, -33.8688];

    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: "mapbox://styles/mapbox/dark-v11",
      center,
      zoom: 11,
    });

    map.addControl(new mapboxgl.NavigationControl(), "top-right");
    mapRef.current = map;

    return () => {
      markersRef.current.forEach((m) => m.remove());
      markersRef.current = [];
      map.remove();
      mapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    const bounds = new mapboxgl.LngLatBounds();
    let hasBounds = false;

    for (const trip of activeTrips) {
      const live = trip.liveLocation;
      const point = live ?? trip.pickup;
      if (!point.latitude && !point.longitude) continue;

      const el = document.createElement("div");
      el.className = "dispatch-marker";
      el.style.width = "14px";
      el.style.height = "14px";
      el.style.borderRadius = "9999px";
      el.style.background = tripMarkerColor(trip.status);
      el.style.border = "2px solid white";
      el.style.boxShadow = "0 0 0 2px rgba(0,0,0,0.25)";
      el.style.cursor = "pointer";

      const marker = new mapboxgl.Marker({ element: el })
        .setLngLat([point.longitude, point.latitude])
        .addTo(map);

      el.addEventListener("click", () => setSelectedTripId(trip.id));
      markersRef.current.push(marker);

      bounds.extend([point.longitude, point.latitude]);
      hasBounds = true;

      if (trip.pickup.latitude || trip.pickup.longitude) {
        const pickupEl = document.createElement("div");
        pickupEl.style.width = "10px";
        pickupEl.style.height = "10px";
        pickupEl.style.borderRadius = "9999px";
        pickupEl.style.background = "#98A2B3";
        pickupEl.style.opacity = "0.8";
        const pickupMarker = new mapboxgl.Marker({ element: pickupEl })
          .setLngLat([trip.pickup.longitude, trip.pickup.latitude])
          .addTo(map);
        markersRef.current.push(pickupMarker);
        bounds.extend([trip.pickup.longitude, trip.pickup.latitude]);
      }
    }

    if (hasBounds) {
      map.fitBounds(bounds, { padding: 80, maxZoom: 14, duration: 800 });
    }
  }, [activeTrips]);

  useEffect(() => {
    const map = mapRef.current;
    const trip = selectedTrip;
    if (!map || !trip) return;
    const live = trip.liveLocation ?? trip.pickup;
    map.flyTo({
      center: [live.longitude, live.latitude],
      zoom: 13,
      essential: true,
    });
  }, [selectedTrip]);

  return (
    <div className="-mx-4 md:-mx-6">
      <div className="grid grid-cols-1 gap-0 xl:grid-cols-[360px_1fr] xl:gap-4 xl:px-6">
        <div className="max-h-[420px] overflow-y-auto border-y border-gray-200 bg-white px-4 py-4 dark:border-gray-800 dark:bg-gray-900 xl:max-h-[calc(100vh-180px)] xl:rounded-2xl xl:border">
          <h3 className="mb-3 font-semibold text-gray-800 dark:text-white/90">
            Active trips ({activeTrips.length})
          </h3>
          {!vm.hasReceivedTripsSnapshot ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Loading…
            </p>
          ) : activeTrips.length === 0 ? (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              No active trips on the map.
            </p>
          ) : (
            <div className="space-y-3">
              {activeTrips.map((trip) => (
                <button
                  key={trip.id}
                  type="button"
                  onClick={() => setSelectedTripId(trip.id)}
                  className={`w-full rounded-xl border p-4 text-left transition ${
                    selectedTrip?.id === trip.id
                      ? "border-brand-500 bg-brand-500/5"
                      : "border-gray-200 dark:border-gray-800"
                  }`}
                >
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <TripStatusBadge status={trip.status} />
                    <Link
                      href={`/bookings/${trip.id}`}
                      className="text-xs font-semibold text-brand-500"
                      onClick={(e) => e.stopPropagation()}
                    >
                      Details
                    </Link>
                  </div>
                  <p className="font-medium text-gray-800 dark:text-white/90">
                    {vm.chauffeurName(trip.driverID)}
                  </p>
                  <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                    {vm.customerName(trip)}
                  </p>
                  <p className="mt-1 truncate text-sm text-gray-500 dark:text-gray-400">
                    {trip.pickupAddressLine ?? "Pickup pending label"}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>

        <div
          ref={mapContainerRef}
          className="h-[480px] w-full xl:h-[calc(100vh-180px)] xl:min-h-[560px] xl:overflow-hidden xl:rounded-2xl xl:border xl:border-gray-800"
        />
      </div>
    </div>
  );
}
