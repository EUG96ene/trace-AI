import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Loader from "@/components/BatchClaimsLoader";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function Sidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Create Claim</Button>
      </SheetTrigger>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Create Claim</SheetTitle>
          <SheetDescription>
            
          </SheetDescription>
        </SheetHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right" style={{ fontSize: '0.8rem' }}>
            Provider Name
            </Label>
            <Input id="name" value="" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right" style={{ fontSize: '0.8rem' }}>
            Provider Code
            </Label>
            <Input id="username" value="" className="col-span-3" />
          </div>
        </div>
        <Loader />
         <SheetFooter style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
             <SheetClose asChild>
             <Button type="submit" style={{ backgroundColor: 'red' }}>Submit</Button>

               </SheetClose>
                         </SheetFooter>

      </SheetContent>
    </Sheet>
  )
}
export default Sidebar;
