import { getMapboxToken } from "@/lib/firebase/config";

type GeocodeResult = {
  latitude: number;
  longitude: number;
};

export async function forwardGeocodeFirstCoordinate(
  query: string
): Promise<GeocodeResult> {
  const trimmed = query.trim();
  if (!trimmed) {
    throw new Error("Enter an address to geocode.");
  }

  const token = getMapboxToken();
  const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(trimmed)}.json?limit=1&access_token=${token}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Could not look up that address. Try again.");
  }

  const payload = (await response.json()) as {
    features?: { center?: [number, number] }[];
  };
  const center = payload.features?.[0]?.center;
  if (!center || center.length < 2) {
    throw new Error(
      "Couldn't find that address on the map. Add a city or postcode and try again."
    );
  }

  return { longitude: center[0], latitude: center[1] };
}
