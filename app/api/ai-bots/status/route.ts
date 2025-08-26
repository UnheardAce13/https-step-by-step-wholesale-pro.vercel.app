import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Simulate AI bot status - in production this would check actual bot health
    const bots = [
      {
        name: "Zikk",
        type: "Lead Capture",
        status: "active",
        lastActivity: new Date().toISOString(),
        processed24h: Math.floor(Math.random() * 50) + 10,
        uptime: "99.8%"
      },
      {
        name: "Huntz", 
        type: "Property Search",
        status: "active",
        lastActivity: new Date().toISOString(),
        processed24h: Math.floor(Math.random() * 30) + 5,
        uptime: "99.5%"
      },
      {
        name: "Automatz",
        type: "Lead Nurturing", 
        status: "active",
        lastActivity: new Date().toISOString(),
        processed24h: Math.floor(Math.random() * 80) + 20,
        uptime: "99.9%"
      },
      {
        name: "Rezz",
        type: "CRM Management",
        status: "active", 
        lastActivity: new Date().toISOString(),
        processed24h: Math.floor(Math.random() * 100) + 30,
        uptime: "99.7%"
      },
      {
        name: "Pipz",
        type: "Pipeline Triggers",
        status: "active",
        lastActivity: new Date().toISOString(), 
        processed24h: Math.floor(Math.random() * 40) + 10,
        uptime: "99.6%"
      },
      {
        name: "Vetzz",
        type: "Contract Review",
        status: "active",
        lastActivity: new Date().toISOString(),
        processed24h: Math.floor(Math.random() * 20) + 5,
        uptime: "99.9%"
      }
    ]

    return NextResponse.json({ 
      bots,
      systemStatus: "operational",
      totalProcessed24h: bots.reduce((sum, bot) => sum + bot.processed24h, 0)
    })

  } catch (error: any) {
    console.error('Bot status error:', error)
    return NextResponse.json({ error: "Failed to get bot status" }, { status: 500 })
  }
}