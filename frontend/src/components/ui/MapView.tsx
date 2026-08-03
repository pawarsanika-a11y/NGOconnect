import { Navigation2, MapPin } from "lucide-react";

interface MapViewProps {
  lat: number;
  lng: number;
  name: string;
  address: string;
}

// Uses the OpenStreetMap embed (no API key needed). Swap the src for the
// Google Maps Embed API (`https://www.google.com/maps/embed/v1/place?key=...`)
// if a Google Maps API key is available in production.
export default function MapView({ lat, lng, name, address }: MapViewProps) {
  const delta = 0.01;
  const bbox = `${lng - delta},${lat - delta},${lng + delta},${lat + delta}`;
  const embedSrc = `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${lat},${lng}`;
  const directionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`;

  return (
    <div className="manifest-card overflow-hidden">
      <div className="relative h-64 w-full">
        <iframe
          title={`Map showing ${name}`}
          src={embedSrc}
          className="h-full w-full border-0"
          loading="lazy"
        />
      </div>
      <div className="flex items-center justify-between gap-3 p-4">
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-sm font-semibold">
            <MapPin className="h-4 w-4 text-primary shrink-0" /> {name}
          </p>
          <p className="truncate text-xs text-ink/50 dark:text-paper/50">{address}</p>
        </div>
        <a href={directionsUrl} target="_blank" rel="noreferrer" className="btn-primary shrink-0 !py-2 text-xs">
          <Navigation2 className="h-3.5 w-3.5" /> Navigate
        </a>
      </div>
    </div>
  );
}
