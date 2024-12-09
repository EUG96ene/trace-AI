import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import Role from "@/components/Role";


export default function Adduser() {
  return (
    <div className="">
      
        
          <div className="flex justify-center ">
            <Card x-chunk="dashboard-04-chunk-1">
              <CardHeader>
                <CardTitle>Add User</CardTitle>
                <CardDescription>
                </CardDescription>
              </CardHeader>
              <CardContent>
                  <form>
         <Input placeholder=" Name" style={{ width: '600px' }} />
                </form>
                </CardContent>
                <CardContent>
                <form>
                  <Input placeholder="Email" />
                </form>
              </CardContent>
              <CardContent>
                <form>
                  <Input placeholder="ID" />
                </form>
              </CardContent>
              <CardContent>
                <form>
                  <Role/>
                </form>
              </CardContent>
              <CardFooter className="border-t px-6 py-4">
                <Button>Submit</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
     
      
    
  );
}
