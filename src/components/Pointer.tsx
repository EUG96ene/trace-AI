import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { ArrowRight } from "lucide-react"

export function Export2() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
        <Button variant="outline">
        <ArrowRight style={{ marginRight: '5px' }} />
    </Button>

        </TooltipTrigger>
        <TooltipContent>   
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default Export2;
