"use client"

import { useEffect, useState } from "react"

export function FloatingElements() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 pointer-events-none -z-10">
      {/* Large floating shapes */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-primary/5 to-secondary/5 rounded-full blur-xl animate-float-slow" />
      <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-secondary/5 to-primary/5 rounded-full blur-xl animate-float-slow delay-1000" />
      <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-br from-primary/3 to-secondary/3 rounded-full blur-2xl animate-float-slow delay-2000" />

      {/* Small floating dots */}
      {Array.from({ length: 15 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-primary/20 rounded-full animate-float"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${10 + Math.random() * 80}%`,
            animationDelay: `${Math.random() * 3}s`,
            animationDuration: `${4 + Math.random() * 3}s`,
          }}
        />
      ))}
    </div>
  )
}
