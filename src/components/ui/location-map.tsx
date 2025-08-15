import * as React from "react"
import { MapModal } from "./map-modal"
import { MapPin } from "lucide-react"
import { cn } from "@/lib/utils"

interface LocationMapProps {
  address: string
  location: string
  className?: string
}

const LocationMap: React.FC<LocationMapProps> = ({
  address,
  location,
  className
}) => {
  return (
    <MapModal address={address} title="Property Location">
      <button className={cn(
        "font-medium hover:text-accent transition-colors cursor-pointer underline decoration-dotted underline-offset-4 flex items-center gap-1",
        className
      )}>
        <MapPin className="h-4 w-4" />
        {location}
      </button>
    </MapModal>
  )
}

export { LocationMap }
