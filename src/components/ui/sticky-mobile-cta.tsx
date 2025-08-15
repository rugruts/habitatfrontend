import * as React from "react"
import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface StickyMobileCTAProps {
  href: string
  children: React.ReactNode
  className?: string
  show?: boolean
}

const StickyMobileCTA: React.FC<StickyMobileCTAProps> = ({
  href,
  children,
  className,
  show = true
}) => {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling down 100px
      setIsVisible(window.scrollY > 100)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  if (!show || !isVisible) return null

  return (
    <div className="lg:hidden fixed bottom-4 left-4 right-4 z-50 animate-slide-up">
      <Button 
        asChild 
        variant="accent" 
        className={cn(
          "w-full h-14 text-base font-semibold shadow-xl bg-accent hover:bg-accent/90 animate-pulse-glow",
          className
        )}
      >
        <Link to={href}>
          {children}
        </Link>
      </Button>
    </div>
  )
}

export { StickyMobileCTA }
