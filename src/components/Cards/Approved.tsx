import { CheckCheck } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function ApprovedClaims() {
  return (
    <Card x-chunk="dashboard-01-chunk-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Approved Claims</CardTitle>
        <CheckCheck className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
      <div className="text-2xl font-bold text-green-500">45</div>
        <p className="text-xs text-muted-foreground">This month</p>
      </CardContent>
    </Card>
    
  )
}
