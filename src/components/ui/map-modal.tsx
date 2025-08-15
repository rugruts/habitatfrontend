import * as React from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, ExternalLink, Navigation, Copy, Castle, TreePine, Utensils, Mountain, Home } from "lucide-react"
import { cn } from "@/lib/utils"
import LeafletMap from "./leaflet-map"
import { Attraction } from "@/data/apartments"



interface MapModalProps {
  address: string
  title?: string
  children?: React.ReactNode
  className?: string
  attractions?: Attraction[]
  showAttractions?: boolean
}

const MapModal: React.FC<MapModalProps> = ({
  address,
  title = "Location",
  children,
  className,
  attractions = [],
  showAttractions = false
}) => {
  const [isOpen, setIsOpen] = React.useState(false)
  const [copied, setCopied] = React.useState(false)



  // Encode address for Google Maps embed
  const encodedAddress = encodeURIComponent(address)

  const getAttractionIcon = (type: string) => {
    switch (type) {
      case 'culture': return Castle
      case 'nature': return TreePine
      case 'dining': return Utensils
      case 'unesco': return Mountain
      default: return MapPin
    }
  }

  const getAttractionColor = (type: string) => {
    switch (type) {
      case 'culture': return 'bg-purple-100 text-purple-700 border-purple-200'
      case 'nature': return 'bg-green-100 text-green-700 border-green-200'
      case 'dining': return 'bg-orange-100 text-orange-700 border-orange-200'
      case 'unesco': return 'bg-blue-100 text-blue-700 border-blue-200'
      default: return 'bg-gray-100 text-gray-700 border-gray-200'
    }
  }

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy address:', err)
    }
  }

  const openInGoogleMaps = () => {
    window.open(`https://www.google.com/maps/search/?api=1&query=${encodedAddress}`, '_blank')
  }

  const openInAppleMaps = () => {
    window.open(`https://maps.apple.com/?q=${encodedAddress}`, '_blank')
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button variant="ghost" className={cn("p-0 h-auto font-medium hover:text-accent", className)}>
            <MapPin className="h-4 w-4 mr-1" />
            View on Map
          </Button>
        )}
      </DialogTrigger>
      
      <DialogContent className="max-w-7xl w-full h-[85vh] p-0">
        <DialogHeader className="p-6 pb-4">
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Home className="h-5 w-5 text-accent" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex-1 px-6 pb-6">
          <div className={cn("grid gap-6", showAttractions ? "grid-cols-1 lg:grid-cols-3" : "grid-cols-1")}>
            {/* Map Container */}
            <div className={cn("space-y-4", showAttractions ? "lg:col-span-2" : "")}>
              {/* Address Info */}
              <div className="bg-accent/5 rounded-lg p-4 space-y-3">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">Property Address</h3>
                    <p className="text-muted-foreground">{address}</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={copyAddress}
                    className="flex-shrink-0"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </div>

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openInGoogleMaps}
                    className="flex-1"
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Google Maps
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={openInAppleMaps}
                    className="flex-1"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Apple Maps
                  </Button>
                </div>
              </div>

              {/* Simple Map */}
              <div className="relative" style={{ height: '400px' }}>
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=21.755%2C39.543%2C21.770%2C39.553&layer=mapnik&marker=39.548363017220765%2C21.76272641054368"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Property Location"
                  className="w-full h-full rounded-lg"
                />
              </div>
            </div>

            {/* Attractions List */}
            {showAttractions && attractions.length > 0 && (
              <div className="space-y-4">
                <h3 className="font-semibold text-lg text-foreground">Nearby Attractions</h3>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {attractions.map((attraction, index) => {
                    const IconComponent = getAttractionIcon(attraction.type)
                    return (
                      <div key={index} className="bg-white border border-accent/20 rounded-lg p-4 hover:shadow-md transition-shadow">
                        <div className="flex items-start gap-3">
                          <div className={cn("p-2 rounded-lg", getAttractionColor(attraction.type))}>
                            <IconComponent className="h-4 w-4" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="font-medium text-foreground text-sm">{attraction.name}</h4>
                              <Badge variant="outline" className="text-xs capitalize">
                                {attraction.type}
                              </Badge>
                            </div>
                            <div className="mt-1 space-y-1">
                              <div className="text-sm font-medium text-accent">{attraction.distance}</div>
                              <div className="text-xs text-muted-foreground">{attraction.time}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export { MapModal }
