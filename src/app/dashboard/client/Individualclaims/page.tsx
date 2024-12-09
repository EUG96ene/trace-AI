"use client";

import React, { useState } from "react";
import Link from "next/link";
import Forminput from "@/components/Forminput";
import FileUploader from "@/components/IndividualClaimsLoader";
import CustomButton from "@/components/Button";
import CustomButton1 from "@/components/Mergebutton"; // Renamed Button to CustomButton1 to avoid conflicts
import Batchname from "@/components/Batchname";
import IndividualClaims from "@/components/IndividualClaimstable";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
export default function Claims() {
  const [batchName, setBatchName] = useState("");


  return (
    <div className="">
      <div>
        <h2 className="text-2xl font-bold mb-4">Individual Claims</h2>
        <Link href="/dashboard/client/claim-form">
          <Button size="sm" className="gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            Create A New Claim
          </Button>
        </Link>
      </div>
      <IndividualClaims />
    </div>
  );
}
