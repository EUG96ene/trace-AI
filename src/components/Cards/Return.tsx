import { Undo2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ReturnedClaims() {
  return (
    <Card x-chunk="dashboard-01-chunk-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Returned Claims</CardTitle>
        <Undo2  className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
      <div className="text-6xl font-bold text-red-500">6</div>

        <p className="text-xs text-muted-foreground">This month</p>
      </CardContent>
    </Card>
    
  )
}
