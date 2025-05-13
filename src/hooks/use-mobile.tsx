
import * as React from "react"

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  )

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return
    }

    const handleResize = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Set correct initial state
    handleResize()
    
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  return isMobile
}
