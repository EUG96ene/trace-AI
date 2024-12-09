"use client";

import React, { useState } from "react";
import Link from "next/link";
import IndividualClaims from "@/components/Client/IndividualClaimstable";
import BatchClaims from "@/components/Client/BatchClaimstable";
import { CalendarDateRangePicker } from "@/components/Admin/Date-range-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

export default function Claims() {
  const [batchName, setBatchName] = useState("");

  return (
    <div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Claims</h2>
      </div>
      <div className="flex x-1">
        <Link href="/dashboard/client/NewClaimUpload">
          <Button size="sm" className="gap-1 bg-red-200">
            <PlusCircle className="h-4 w-4 text-black" />
            <span className="text-lg text-black">Create A New Claim</span>
          </Button>
        </Link>
        <span className="mx-4"></span> {/* Space between the links */}
        <Link href="/dashboard/client/Batchclaimsupload">
          <Button size="sm" className="gap-1 bg-red-200">
            <PlusCircle className="h-4 w-4 text-black" />
            <span className="text-lg text-black">Create A Batch Claim</span>
          </Button>
        </Link>
      </div>
      <span className="mx-4"></span>
      <div className="">
        <Tabs defaultValue="Individual" className="space-y-4">
          <TabsList>
            <TabsTrigger value="Individual">Individual Claims</TabsTrigger>
            <TabsTrigger value="batch">Batch Claims</TabsTrigger>
          </TabsList>
          <TabsContent value="Individual" className="space-y-4">
            <IndividualClaims />
          </TabsContent>
          <TabsContent value="batch" className="space-y-4">
            <BatchClaims />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
