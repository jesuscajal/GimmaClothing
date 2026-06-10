import { HttpTypes } from "@medusajs/types"
import { NextRequest, NextResponse } from "next/server"
import { gimmaConfig } from "@lib/gimma/config"

const BACKEND_URL = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const PUBLISHABLE_API_KEY = process.env.NEXT_PUBLIC_MEDUSA_PUBLISHABLE_KEY
const DEFAULT_REGION = process.env.NEXT_PUBLIC_DEFAULT_REGION || "ar"

const regionMapCache = {
  regionMap: new Map<string, HttpTypes.StoreRegion>(),
  regionMapUpdated: Date.now(),
  fetchFailed: false,
}

async function getRegionMap(cacheId: string) {
  const { regionMap, regionMapUpdated } = regionMapCache

  if (!BACKEND_URL || !PUBLISHABLE_API_KEY) {
    return new Map<string, HttpTypes.StoreRegion>()
  }

  if (
    !regionMap.keys().next().value ||
    regionMapUpdated < Date.now() - 3600 * 1000
  ) {
    try {
      const response = await fetch(`${BACKEND_URL}/store/regions`, {
        method: "GET",
        headers: {
          "x-publishable-api-key": PUBLISHABLE_API_KEY,
        },
        next: {
          revalidate: 3600,
          tags: [`regions-${cacheId}`],
        },
        cache: "force-cache",
      })

      if (!response.ok) {
        throw new Error(`Backend returned ${response.status}`)
      }

      const json = await response.json()
      const { regions } = json

      regionMapCache.regionMap = new Map<string, HttpTypes.StoreRegion>()
      regionMapCache.fetchFailed = false

      if (regions?.length) {
        regions.forEach((region: HttpTypes.StoreRegion) => {
          region.countries?.forEach((c) => {
            regionMapCache.regionMap.set(c.iso_2 ?? "", region)
          })
        })
      }

      regionMapCache.regionMapUpdated = Date.now()
    } catch {
      regionMapCache.fetchFailed = true
      if (!regionMap.keys().next().value) {
        regionMapCache.regionMap = new Map<string, HttpTypes.StoreRegion>()
      }
    }
  }

  return regionMapCache.regionMap
}

async function getCountryCode(
  request: NextRequest,
  regionMap: Map<string, HttpTypes.StoreRegion | number>
) {
  let countryCode

  const urlCountryCode = request.nextUrl.pathname.split("/")[1]?.toLowerCase()

  const cloudflareCountryCode = (request as { cf?: { country?: string } }).cf
    ?.country?.toLowerCase()

  const vercelCountryCode = request.headers
    .get("x-vercel-ip-country")
    ?.toLowerCase()

  if (urlCountryCode && regionMap.has(urlCountryCode)) {
    countryCode = urlCountryCode
  } else if (cloudflareCountryCode && regionMap.has(cloudflareCountryCode)) {
    countryCode = cloudflareCountryCode
  } else if (vercelCountryCode && regionMap.has(vercelCountryCode)) {
    countryCode = vercelCountryCode
  } else if (regionMap.has(DEFAULT_REGION)) {
    countryCode = DEFAULT_REGION
  } else if (regionMap.keys().next().value) {
    countryCode = regionMap.keys().next().value
  } else if (urlCountryCode) {
    countryCode = urlCountryCode
  }

  return countryCode
}

export async function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith("/demo")) {
    return NextResponse.next()
  }

  if (request.nextUrl.pathname === "/") {
    if (gimmaConfig.isDemoRoot()) {
      return NextResponse.redirect(new URL("/demo", request.url))
    }
    return NextResponse.redirect(
      new URL(gimmaConfig.productionHome(), request.url)
    )
  }

  if (request.nextUrl.pathname.includes(".")) {
    return NextResponse.next()
  }

  const pathSegments = request.nextUrl.pathname.split("/").filter(Boolean)
  if (pathSegments.length === 1 && !gimmaConfig.isDemoRoot()) {
    const cacheIdCookie = request.cookies.get("_medusa_cache_id")
    const cacheId = cacheIdCookie?.value || crypto.randomUUID()
    const regionMap = await getRegionMap(cacheId)
    const code = pathSegments[0].toLowerCase()
    if (regionMap.has(code) || code === DEFAULT_REGION) {
      return NextResponse.redirect(new URL(`/${code}/inicio`, request.url))
    }
  }

  const cacheIdCookie = request.cookies.get("_medusa_cache_id")
  const cacheId = cacheIdCookie?.value || crypto.randomUUID()

  const regionMap = await getRegionMap(cacheId)
  const countryCode = await getCountryCode(request, regionMap)

  const country = countryCode || DEFAULT_REGION
  const firstPathSegment = request.nextUrl.pathname.split("/")[1]?.toLowerCase()
  const urlHasCountry = firstPathSegment === country.toLowerCase()

  if (urlHasCountry) {
    if (!cacheIdCookie) {
      const response = NextResponse.next()
      response.cookies.set("_medusa_cache_id", cacheId, {
        maxAge: 60 * 60 * 24,
      })
      return response
    }
    return NextResponse.next()
  }

  const redirectPath =
    request.nextUrl.pathname === "/" ? "" : request.nextUrl.pathname
  const queryString = request.nextUrl.search || ""
  const redirectUrl = `${request.nextUrl.origin}/${country}${redirectPath}${queryString}`

  return NextResponse.redirect(redirectUrl, 307)
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images|assets|png|svg|jpg|jpeg|gif|webp).*)",
  ],
}
