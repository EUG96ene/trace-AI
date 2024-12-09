import { Globe } from "lucide-react"

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card"

export function HoverCardDemo1() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link">@website</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fafricanfinancials.com%2Fcompany%2Fke-cic%2F&psig=AOvVaw3FGzYdI39KD9EciZ9UtFIs&ust=1714779545728000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCLi54uCR8IUDFQAAAAAdAAAAABAE" />
            <AvatarFallback>CIC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@Website</h4>
            <p className="text-sm">
            cicinsurancegroup.com
            </p>
            <div className="flex items-center pt-2">
              <Globe className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                Visit Our Website
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
 
export default HoverCardDemo1;