"use client";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Userdetails() {
  const { data: session } = useSession();
  const user = session?.user?.user;

  return (
    <div className="">
      <div className="flex justify-center">
        <Card x-chunk="dashboard-04-chunk-1">
          <CardHeader>
            <CardTitle>Account Details</CardTitle>
            <CardDescription></CardDescription>
          </CardHeader>
          <CardContent>
            <form>
              <div className="grid gap-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    placeholder="Name"
                    defaultValue={user?.name || ""}
                    className="col-span-3"
                    disabled
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    placeholder="Email"
                    defaultValue={user?.email || ""}
                    className="col-span-3"
                    disabled
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="staffID" className="text-right">
                    ID
                  </Label>
                  <Input
                    id="staffID"
                    placeholder="ID"
                    defaultValue={user?.staffID || ""}
                    className="col-span-3"
                    disabled
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Input
                    id="role"
                    placeholder="Role"
                    defaultValue={user?.role || ""}
                    className="col-span-3"
                    disabled
                  />
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
