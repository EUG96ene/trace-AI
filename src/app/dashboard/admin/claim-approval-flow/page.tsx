"use client";

import React, { useState } from "react";
import ApprovalProcessFlow from '@/components/Admin/ClaimApprovalFlow/Flow'

export default function Claims() {
  const [batchName, setBatchName] = useState("");


  return (
    <div className="">
      <div>
        <h2 className="text-2xl font-bold mb-4">Approval Flow</h2>
        
      </div>
      <div>
      <ApprovalProcessFlow/>
      </div>
   
    </div>
  );
}
