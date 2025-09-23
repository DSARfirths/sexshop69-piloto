import { NextRequest, NextResponse } from "next/server";
import products from "./data/products.json";

const nsfwSlugs = new Set(products.filter((product) => product.nsfw).map((product) => product.slug));

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (!pathname.startsWith("/products/")) {
    return NextResponse.next();
  }

  const segments = pathname.split("/").filter(Boolean);
  const slug = segments[1];

  if (!slug || !nsfwSlugs.has(slug)) {
    return NextResponse.next();
  }

  const response = NextResponse.next();
  response.headers.append("X-Robots-Tag", "noimageindex");
  return response;
}

export const config = {
  matcher: ["/products/:path*"],
};

// Routes outside of /products (e.g. /_next/ assets) bypass this middleware via the matcher above.
