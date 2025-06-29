
"use client"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { InfoContent } from "@/components/info-content"

function InfoPageContents() {
  return (
    <div className="min-h-screen bg-background text-foreground p-4 sm:p-6 lg:p-8 font-body">
      <div className="max-w-4xl mx-auto">
        <Button asChild variant="outline" className="mb-8">
          <Link href="/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>

        <Card className="bg-card/70 backdrop-blur-xl border border-white/10">
          <CardHeader>
            <CardTitle className="text-3xl font-headline">Health & Hydration Information</CardTitle>
            <CardDescription className="text-lg">
              Guidance and information provided by Downscale Weight Loss Clinic.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <InfoContent />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


export default function InfoPage() {
  return <InfoPageContents />
}
