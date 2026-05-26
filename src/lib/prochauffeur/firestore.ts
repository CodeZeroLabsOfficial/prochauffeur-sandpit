import {
  collection,
  doc,
  getDoc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/client";
import { parseTrip, parseUser } from "@/lib/prochauffeur/parse";
import type { AppUser, Trip, TripStatus } from "@/lib/prochauffeur/types";

const TRIPS = "trips";
const USERS = "users";

export function listenTripsForAdminOverview(
  onUpdate: (trips: Trip[]) => void,
  tripLimit = 800
): () => void {
  const q = query(
    collection(getFirestoreDb(), TRIPS),
    orderBy("createdAt", "desc"),
    limit(tripLimit)
  );
  return onSnapshot(q, (snapshot) => {
    const trips = snapshot.docs.map((d) => parseTrip(d.id, d.data()));
    onUpdate(trips);
  });
}

export function listenUsersForAdmin(onUpdate: (users: AppUser[]) => void): () => void {
  return onSnapshot(collection(getFirestoreDb(), USERS), (snapshot) => {
    const users = snapshot.docs.map((d) => parseUser(d.id, d.data()));
    onUpdate(users);
  });
}

export function listenTrip(
  tripId: string,
  onUpdate: (trip: Trip | null) => void
): () => void {
  return onSnapshot(doc(getFirestoreDb(), TRIPS, tripId), (snapshot) => {
    if (!snapshot.exists()) {
      onUpdate(null);
      return;
    }
    onUpdate(parseTrip(snapshot.id, snapshot.data()));
  });
}

export async function fetchUserProfile(uid: string): Promise<AppUser | null> {
  const snap = await getDoc(doc(getFirestoreDb(), USERS, uid));
  if (!snap.exists()) return null;
  return parseUser(snap.id, snap.data());
}

export async function updateTripStatus(
  tripId: string,
  status: TripStatus
): Promise<void> {
  await updateDoc(doc(getFirestoreDb(), TRIPS, tripId), {
    status,
    updatedAt: serverTimestamp(),
  });
}
