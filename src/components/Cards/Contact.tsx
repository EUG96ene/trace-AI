import { CircleUser } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import HoverCardDemo1 from "@/components/Hovercontact";


export default function Contact() {
  return (
    <Card x-chunk="dashboard-01-chunk-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-lg font-medium text-red-500">Contact</CardTitle>
        <CircleUser className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
      <div className="flex justify-center">
        <HoverCardDemo1/>
        </div>
      </CardContent>
    </Card>
    
  )
}
