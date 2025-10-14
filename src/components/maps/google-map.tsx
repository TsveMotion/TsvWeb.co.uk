"use client"

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
  // Simple fallback component - no Google Maps
  return (
    <div 
      className={`flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-700 rounded-lg ${className}`}
      style={{ height }}
    >
      <div className="text-center p-8">
        <div className="mb-6">
          <svg className="w-20 h-20 mx-auto text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
        </div>
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          📍 Birmingham, UK
        </h3>
        <p className="text-gray-700 dark:text-gray-300 mb-4 max-w-md">
          We're based in Birmingham and serve businesses across the West Midlands.
        </p>
        <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
          <p className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
            </svg>
            <span className="font-medium">07444 358808</span>
          </p>
          <p className="flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
              <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
            </svg>
            <span>info@tsvweb.com</span>
          </p>
        </div>
        {markers.length > 0 && (
          <div className="mt-6 pt-6 border-t border-gray-300 dark:border-gray-600">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Locations:</p>
            <div className="space-y-1">
              {markers.map((marker, index) => (
                <p key={index} className="text-sm text-gray-600 dark:text-gray-400">
                  📍 {marker.title}
                </p>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
