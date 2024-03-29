import { Ratelimit } from '@upstash/ratelimit'
import { Redis } from '@upstash/redis'
import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

const redis=new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL || '',
   token: process.env.UPSTASH_REDIS_REST_TOKEN || ''
})
console.log(process.env.REDIS_URL)
const ratelimit=new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(50, '1 h'),
})
export default withAuth(
   async function middleware(req) {
    const pathname=req.nextUrl.pathname

    if(pathname.startsWith('/api')){
        const ip=req.ip ?? '127.0.01'
        try {
            const {success}=await ratelimit.limit(ip)

            if(!success) return NextResponse.json({error:"Too many request"})
        } catch (error) {
            return NextResponse.json({error:"Internal server error"})
        }
    }
    //Mange route protection
    const token =await getToken({req})
    const isAuth=!!token

    const isAuthPage=pathname.startsWith('/login')

    const sensitiveRoutes = ['/dashboard']

    if (isAuthPage) {
      if (isAuth) {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }

      return null
    }

    if(!isAuth && sensitiveRoutes.some((route)=>pathname.startsWith(route))){
        return NextResponse.redirect(new URL('/login', req.url))
    }
  },
  {
    callbacks: {
      async authorized() {
        // This is a work-around for handling redirect on auth pages.
        // We return true here so that the middleware function above
        // is always called.
        return true
      },
    },
  }
)

export const config = {
  matcher: ['/', '/login', '/dashboard/:path*', '/api/:path*'],
}