"use client";

import React, { useState } from "react";
import Link from "next/link";
import IndividualClaims from "@/components/Admin/Approvals/IndividualClaimsTable";
import BatchClaims from "@/components/Admin/Approvals/BatchClaimTable";
import { CalendarDateRangePicker } from "@/components/Admin/Date-range-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Claims() {
  const [batchName, setBatchName] = useState("");

  return (
    <div className="">
      <div>
        <h2 className="text-2xl font-bold mb-4">Claims</h2>
      </div>
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
  );
}
