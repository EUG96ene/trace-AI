import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { FileUp } from "lucide-react"

export function Export1() {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
        <Button variant="outline">
         <FileUp style={{ marginRight: '5px' }} /> Export
    </Button>

        </TooltipTrigger>
        <TooltipContent>
          <p>Export to Excel</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}

export default Export1;
