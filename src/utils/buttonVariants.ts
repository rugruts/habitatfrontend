import { cva } from "class-variance-authority"

export const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-md",
        outline:
          "border border-input bg-background hover:bg-secondary hover:text-secondary-foreground hover:shadow-sm",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-sm",
        ghost: "hover:bg-accent/20 hover:text-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        accent: "bg-accent text-accent-foreground hover:bg-accent/90 hover:shadow-md",
        hero: "gradient-accent text-accent-foreground hover:shadow-lg hover:scale-105 ring-1 ring-accent/30 font-semibold",
        gradient: "gradient-primary text-primary-foreground hover:shadow-lg hover:scale-105",
        glass: "glass-effect text-foreground hover:bg-white/20 backdrop-blur-md",
        glow: "bg-accent text-accent-foreground hover:shadow-glow hover:scale-105",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-lg px-10 text-lg",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)



