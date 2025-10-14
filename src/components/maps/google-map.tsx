"use client"

import { useEffect, useRef, useState } from 'react'

interface GoogleMapProps {
  center?: {
    lat: number
    lng: number
  }
  zoom?: number
  markers?: Array<{
    position: { lat: number; lng: number }
    title: string
    info?: string
  }>
  height?: string
  className?: string
}

export default function GoogleMap({
  center = { lat: 52.4862, lng: -1.8904 }, // Birmingham city centre
  zoom = 13,
  markers = [],
  height = '400px',
  className = ''
}: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [map, setMap] = useState<google.maps.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Check if API key is set
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
    
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      setError('Google Maps API key not configured')
      return
    }

    // Check if Google Maps script is already loaded
    if (window.google && window.google.maps) {
      setIsLoaded(true)
      return
    }

    // Load Google Maps script
    const script = document.createElement('script')
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`
    script.async = true
    script.defer = true
    
    script.onload = () => {
      setIsLoaded(true)
    }
    
    script.onerror = () => {
      setError('Failed to load Google Maps')
    }

    document.head.appendChild(script)

    return () => {
      // Cleanup script on unmount
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  useEffect(() => {
    if (!isLoaded || !mapRef.current || map) return

    // Initialize map
    const newMap = new google.maps.Map(mapRef.current, {
      center,
      zoom,
      styles: [
        {
          featureType: 'all',
          elementType: 'geometry',
          stylers: [{ color: '#f5f5f5' }]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{ color: '#e9e9e9' }]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{ color: '#9e9e9e' }]
        },
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }]
        }
      ],
      mapTypeControl: true,
      streetViewControl: true,
      fullscreenControl: true,
      zoomControl: true,
    })

    setMap(newMap)
  }, [isLoaded, center, zoom, map])

  useEffect(() => {
    if (!map || !isLoaded) return

    // Clear existing markers
    // Add new markers
    markers.forEach((marker) => {
      const mapMarker = new google.maps.Marker({
        position: marker.position,
        map: map,
        title: marker.title,
        animation: google.maps.Animation.DROP,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#007BFF',
          fillOpacity: 1,
          strokeColor: '#ffffff',
          strokeWeight: 2,
        }
      })

      // Add info window if info is provided
      if (marker.info) {
        const infoWindow = new google.maps.InfoWindow({
          content: `
            <div style="padding: 10px; max-width: 200px;">
              <h3 style="margin: 0 0 8px 0; font-weight: bold; color: #007BFF;">${marker.title}</h3>
              <p style="margin: 0; color: #666;">${marker.info}</p>
            </div>
          `
        })

        mapMarker.addListener('click', () => {
          infoWindow.open(map, mapMarker)
        })
      }
    })
  }, [map, markers, isLoaded])

  if (error) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}
        style={{ height }}
      >
        <div className="text-center p-6">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
          </svg>
          <p className="text-gray-600 dark:text-gray-400 font-medium">{error}</p>
          <p className="text-sm text-gray-500 dark:text-gray-500 mt-2">
            Please add your Google Maps API key to .env.local
          </p>
        </div>
      </div>
    )
  }

  if (!isLoaded) {
    return (
      <div 
        className={`flex items-center justify-center bg-gray-100 dark:bg-gray-800 rounded-lg ${className}`}
        style={{ height }}
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#007BFF] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading map...</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      ref={mapRef} 
      className={`rounded-lg shadow-lg ${className}`}
      style={{ height }}
    />
  )
}
