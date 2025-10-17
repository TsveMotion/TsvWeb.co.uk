import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/admin/analytics/google
 * Fetch Google Analytics data for the dashboard using GA4 Data API
 */

// Function to create JWT token for Google API authentication
async function createJWT(clientEmail: string, privateKey: string): Promise<string> {
  const header = {
    alg: 'RS256',
    typ: 'JWT'
  }

  const now = Math.floor(Date.now() / 1000)
  const claim = {
    iss: clientEmail,
    scope: 'https://www.googleapis.com/auth/analytics.readonly',
    aud: 'https://oauth2.googleapis.com/token',
    exp: now + 3600,
    iat: now
  }

  // Base64 URL encode
  const base64UrlEncode = (obj: any) => {
    return Buffer.from(JSON.stringify(obj))
      .toString('base64')
      .replace(/=/g, '')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
  }

  const encodedHeader = base64UrlEncode(header)
  const encodedClaim = base64UrlEncode(claim)
  const signatureInput = `${encodedHeader}.${encodedClaim}`

  // Sign with private key
  const crypto = require('crypto')
  const sign = crypto.createSign('RSA-SHA256')
  sign.update(signatureInput)
  const signature = sign.sign(privateKey, 'base64')
    .replace(/=/g, '')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')

  return `${signatureInput}.${signature}`
}

// Function to get access token
async function getAccessToken(clientEmail: string, privateKey: string): Promise<string> {
  const jwt = await createJWT(clientEmail, privateKey)

  const response = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt
    })
  })

  const data = await response.json()
  return data.access_token
}

export async function GET(request: NextRequest) {
  try {
    // Check if Google Analytics is configured
    const propertyId = process.env.GOOGLE_ANALYTICS_PROPERTY_ID
    const clientEmail = process.env.GOOGLE_ANALYTICS_CLIENT_EMAIL
    let privateKey = process.env.GOOGLE_ANALYTICS_PRIVATE_KEY

    if (!propertyId || !clientEmail || !privateKey) {
      // Return zeros if not configured
      return NextResponse.json({
        success: true,
        data: {
          pageViews: 0,
          users: 0,
          sessions: 0,
          bounceRate: 0,
          avgSessionDuration: 0
        },
        configured: false,
        message: 'Google Analytics not configured. Add service account to GA4 property and set environment variables.'
      })
    }

    // Check if property ID needs "properties/" prefix
    const formattedPropertyId = propertyId.startsWith('properties/') 
      ? propertyId 
      : `properties/${propertyId}`

    // Replace escaped newlines in private key
    privateKey = privateKey.replace(/\\n/g, '\n')

    try {
      // Get access token
      const accessToken = await getAccessToken(clientEmail, privateKey)

      // Fetch analytics data from GA4 Data API
      const analyticsResponse = await fetch(
        `https://analyticsdata.googleapis.com/v1beta/${formattedPropertyId}:runReport`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            dateRanges: [{ startDate: '30daysAgo', endDate: 'today' }],
            metrics: [
              { name: 'screenPageViews' },
              { name: 'activeUsers' },
              { name: 'sessions' },
              { name: 'bounceRate' },
              { name: 'averageSessionDuration' }
            ]
          })
        }
      )

      if (!analyticsResponse.ok) {
        const errorData = await analyticsResponse.json()
        console.error('GA4 API Error:', errorData)
        throw new Error(`GA4 API returned ${analyticsResponse.status}`)
      }

      const analyticsData = await analyticsResponse.json()

      // Extract metrics from response
      const row = analyticsData.rows?.[0]?.metricValues || []
      
      return NextResponse.json({
        success: true,
        data: {
          pageViews: parseInt(row[0]?.value || '0'),
          users: parseInt(row[1]?.value || '0'),
          sessions: parseInt(row[2]?.value || '0'),
          bounceRate: parseFloat((parseFloat(row[3]?.value || '0') * 100).toFixed(1)),
          avgSessionDuration: parseFloat(row[4]?.value || '0')
        },
        configured: true
      })

    } catch (apiError: any) {
      console.error('Error calling GA4 API:', apiError)
      
      // Return friendly error message
      return NextResponse.json({
        success: true,
        data: {
          pageViews: 0,
          users: 0,
          sessions: 0,
          bounceRate: 0,
          avgSessionDuration: 0
        },
        configured: false,
        message: `GA4 API Error: ${apiError.message}. Make sure service account has access to GA4 property.`
      })
    }

  } catch (error: any) {
    console.error('Error fetching Google Analytics data:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'Failed to fetch analytics data',
        error: error.message,
        data: {
          pageViews: 0,
          users: 0,
          sessions: 0,
          bounceRate: 0,
          avgSessionDuration: 0
        }
      },
      { status: 500 }
    )
  }
}
