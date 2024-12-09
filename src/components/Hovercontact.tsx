import { CircleUser } from "lucide-react"

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
        <Button variant="link">@Contact</Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarImage src="https://www.google.com/url?sa=i&url=https%3A%2F%2Fafricanfinancials.com%2Fcompany%2Fke-cic%2F&psig=AOvVaw3FGzYdI39KD9EciZ9UtFIs&ust=1714779545728000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCLi54uCR8IUDFQAAAAAdAAAAABAE" />
            <AvatarFallback>CIC</AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">@Contact</h4>
            <p className="text-sm">
            (+254) 703 099 999, (+254) 732 179 999, (020) 28 23 999
            </p>
            <div className="flex items-center pt-2">
              <CircleUser className="mr-2 h-4 w-4 opacity-70" />{" "}
              <span className="text-xs text-muted-foreground">
                Contact Us
              </span>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
 
export default HoverCardDemo1;