'use client'

import { useState } from 'react'
import { X } from 'lucide-react'

interface LiveStreamModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LiveStreamModal({ isOpen, onClose }: LiveStreamModalProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/80" onClick={onClose} />

      {/* Modal */}
      <div className="relative bg-card border border-border rounded-lg shadow-2xl max-w-2xl w-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <div className="flex items-center gap-2">
            <span className="text-green-400 text-sm">📺</span>
            <h2 className="text-lg font-semibold text-foreground">Live News Stream</h2>
            <span className="relative flex h-2 w-2">
              <span className="pulse-live absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-muted rounded-lg transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Video Container */}
        <div className="p-4 bg-black">
          <div className="relative w-full aspect-video bg-black rounded overflow-hidden">
            <iframe
              width="100%"
              height="100%"
              src="https://www.youtube.com/live/iEpJwprxDdk?si=SbMiAVK3aPQEzdh0"
              title="Live News Stream"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0"
            />
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-border bg-card/50">
          <p className="text-xs text-muted-foreground">
            Live market news stream | Click outside or X to close
          </p>
        </div>
      </div>
    </div>
  )
}
