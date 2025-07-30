import { NextResponse } from "next/server"
import { initDatabase } from "@/lib/db"

export async function POST() {
  try {
    const result = await initDatabase()
    return NextResponse.json(result)
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json(
      {
        error: "Failed to initialize database",
        details: error instanceof Error ? error.message : "Unknown error",
        env_check: {
          supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        },
      },
      { status: 500 },
    )
  }
}

export async function GET() {
  try {
    const result = await initDatabase()
    return NextResponse.json({
      ...result,
      timestamp: new Date().toISOString(),
      env_check: {
        supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    })
  } catch (error) {
    console.error("Error connecting to database:", error)
    return NextResponse.json(
      {
        error: "Failed to connect to database",
        details: error instanceof Error ? error.message : "Unknown error",
        env_check: {
          supabase_url: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          service_key: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        },
      },
      { status: 500 },
    )
  }
}
