"use client";

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  activityHeadline,
  chauffeurDisplayName,
  customerDisplayName,
  formatSummaryDateTime,
} from "@/lib/prochauffeur/display";
import {
  listenTripsForAdminOverview,
  listenUsersForAdmin,
  updateTripStatus,
} from "@/lib/prochauffeur/firestore";
import type {
  AdminActivityItem,
  AppUser,
  Trip,
  TripStatus,
  TripVolumeChartPeriod,
} from "@/lib/prochauffeur/types";
import { isUpcomingTripStatus } from "@/lib/prochauffeur/types";
import { tripVolumeSection } from "@/lib/prochauffeur/tripVolume";

type AdminDashboardContextValue = {
  trips: Trip[];
  users: AppUser[];
  userById: Map<string, AppUser>;
  hasReceivedTripsSnapshot: boolean;
  customerAccounts: number;
  chauffeurAccounts: number;
  activeTripsInWindow: number;
  tripsBookedToday: number;
  upcomingTrips: Trip[];
  upcomingTripPreview: Trip[];
  recentActivityItems: AdminActivityItem[];
  bookingMutationTripID: string | null;
  bookingActionError: string | null;
  clearBookingActionError: () => void;
  confirmTripBooking: (id: string) => Promise<void>;
  declineTripBooking: (id: string) => Promise<void>;
  cancelActiveTrip: (id: string) => Promise<void>;
  completeTripBooking: (id: string) => Promise<void>;
  tripVolumeSection: (period: TripVolumeChartPeriod) => {
    bars: { id: string; label: string; count: number }[];
    total: number;
  };
  chauffeurName: (driverID: string | null | undefined) => string;
  customerName: (trip: Trip) => string;
  refreshListeners: () => void;
};

const AdminDashboardContext = createContext<AdminDashboardContextValue | null>(
  null
);

export function AdminDashboardProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [users, setUsers] = useState<AppUser[]>([]);
  const [hasReceivedTripsSnapshot, setHasReceivedTripsSnapshot] =
    useState(false);
  const [bookingMutationTripID, setBookingMutationTripID] = useState<
    string | null
  >(null);
  const [bookingActionError, setBookingActionError] = useState<string | null>(
    null
  );
  const [listenerKey, setListenerKey] = useState(0);

  useEffect(() => {
    setHasReceivedTripsSnapshot(false);
    const unsubTrips = listenTripsForAdminOverview((list) => {
      setHasReceivedTripsSnapshot(true);
      setTrips(list);
    });
    const unsubUsers = listenUsersForAdmin(setUsers);
    return () => {
      unsubTrips();
      unsubUsers();
    };
  }, [listenerKey]);

  const userById = useMemo(
    () => new Map(users.map((u) => [u.id, u])),
    [users]
  );

  const { customerAccounts, chauffeurAccounts } = useMemo(() => {
    let customers = 0;
    let chauffeurs = 0;
    for (const u of users) {
      if (u.role === "customer") customers += 1;
      if (u.role === "driver") chauffeurs += 1;
    }
    return { customerAccounts: customers, chauffeurAccounts: chauffeurs };
  }, [users]);

  const upcomingTrips = useMemo(
    () =>
      trips
        .filter((t) => isUpcomingTripStatus(t.status))
        .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()),
    [trips]
  );

  const activeTripsInWindow = upcomingTrips.length;

  const upcomingTripPreview = useMemo(
    () => upcomingTrips.slice(0, 5),
    [upcomingTrips]
  );

  const tripsBookedToday = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return trips.filter((t) => {
      const d = new Date(t.createdAt);
      d.setHours(0, 0, 0, 0);
      return d.getTime() === today.getTime();
    }).length;
  }, [trips]);

  const recentActivityItems = useMemo<AdminActivityItem[]>(() => {
    return [...trips]
      .sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
      .map((trip) => ({
        id: trip.id,
        headline: activityHeadline(trip.status),
        subline: `${customerDisplayName(trip, userById)} · ${formatSummaryDateTime(trip.updatedAt)}`,
        occurredAt: trip.updatedAt,
      }));
  }, [trips, userById]);

  const mutateTripStatus = useCallback(
    async (id: string, allowedCurrent: TripStatus[], next: TripStatus) => {
      const current = trips.find((t) => t.id === id)?.status;
      if (!current || !allowedCurrent.includes(current)) return;
      setBookingActionError(null);
      setBookingMutationTripID(id);
      try {
        await updateTripStatus(id, next);
      } catch (e) {
        setBookingActionError(
          e instanceof Error ? e.message : "Could not update booking."
        );
      } finally {
        setBookingMutationTripID(null);
      }
    },
    [trips]
  );

  const confirmTripBooking = useCallback(
    (id: string) => mutateTripStatus(id, ["requested"], "accepted"),
    [mutateTripStatus]
  );

  const declineTripBooking = useCallback(
    (id: string) => mutateTripStatus(id, ["requested"], "cancelled"),
    [mutateTripStatus]
  );

  const cancelActiveTrip = useCallback(
    (id: string) =>
      mutateTripStatus(
        id,
        ["accepted", "en_route_pickup", "in_progress"],
        "cancelled"
      ),
    [mutateTripStatus]
  );

  const completeTripBooking = useCallback(
    (id: string) =>
      mutateTripStatus(
        id,
        ["accepted", "en_route_pickup", "in_progress"],
        "completed"
      ),
    [mutateTripStatus]
  );

  const value = useMemo<AdminDashboardContextValue>(
    () => ({
      trips,
      users,
      userById,
      hasReceivedTripsSnapshot,
      customerAccounts,
      chauffeurAccounts,
      activeTripsInWindow,
      tripsBookedToday,
      upcomingTrips,
      upcomingTripPreview,
      recentActivityItems,
      bookingMutationTripID,
      bookingActionError,
      clearBookingActionError: () => setBookingActionError(null),
      confirmTripBooking,
      declineTripBooking,
      cancelActiveTrip,
      completeTripBooking,
      tripVolumeSection: (period) => tripVolumeSection(trips, period),
      chauffeurName: (driverID) => chauffeurDisplayName(userById, driverID),
      customerName: (trip) => customerDisplayName(trip, userById),
      refreshListeners: () => setListenerKey((k) => k + 1),
    }),
    [
      activeTripsInWindow,
      bookingActionError,
      bookingMutationTripID,
      cancelActiveTrip,
      chauffeurAccounts,
      completeTripBooking,
      confirmTripBooking,
      customerAccounts,
      declineTripBooking,
      hasReceivedTripsSnapshot,
      recentActivityItems,
      trips,
      tripsBookedToday,
      upcomingTripPreview,
      upcomingTrips,
      userById,
      users,
    ]
  );

  return (
    <AdminDashboardContext.Provider value={value}>
      {children}
    </AdminDashboardContext.Provider>
  );
}

export function useAdminDashboard(): AdminDashboardContextValue {
  const ctx = useContext(AdminDashboardContext);
  if (!ctx) {
    throw new Error(
      "useAdminDashboard must be used within AdminDashboardProvider"
    );
  }
  return ctx;
}
