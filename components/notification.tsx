"use client"

import { useState, useEffect } from "react"
import { X, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface NotificationProps {
  title?: string
  message: string
  type?: "error" | "success" | "warning" | "info"
  duration?: number
  onClose?: () => void
}

export default function Notification({ title, message, type = "error", duration = 5000, onClose }: NotificationProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
        onClose?.()
      }, duration)

      return () => clearTimeout(timer)
    }
  }, [duration, onClose])

  const handleClose = () => {
    setIsVisible(false)
    onClose?.()
  }

  if (!isVisible) return null

  const getTypeStyles = () => {
    switch (type) {
      case "error":
        return "bg-red-600/90 border-red-500 text-white"
      case "success":
        return "bg-green-600/90 border-green-500 text-white"
      case "warning":
        return "bg-yellow-600/90 border-yellow-500 text-white"
      case "info":
        return "bg-blue-600/90 border-blue-500 text-white"
      default:
        return "bg-red-600/90 border-red-500 text-white"
    }
  }

  return (
    <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 animate-in slide-in-from-top duration-300">
      <div className={`flex flex-col gap-1 p-4 rounded-lg border backdrop-blur-sm shadow-lg max-w-md w-[90vw] ${getTypeStyles()}`}>
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            {title && <h4 className="font-semibold text-sm">{title}</h4>}
            <p className="text-sm opacity-90">{message}</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="p-1 h-auto text-white/80 hover:bg-white/10 hover:text-white -mt-1 -mr-2"
            onClick={handleClose}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}
