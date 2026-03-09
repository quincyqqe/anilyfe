import { useEffect, useState } from "react"

export function useSearchModal() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const open = () => setIsOpen(true)
    window.addEventListener("open-search-modal", open)

    return () => window.removeEventListener("open-search-modal", open)
  }, [])

  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false)
  }
}