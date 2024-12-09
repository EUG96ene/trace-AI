"use client";

import React, { useState } from "react";
import Forminput from "@/components/Forminput";
import Loader from "@/components/BatchClaimsLoader";
import CustomButton from "@/components/Button";
import CustomButton1 from "@/components/Mergebutton"; 
import BatchClaims from "@/components/BatchClaimstable";


export default function Claims() {


  return (
    <div className="">
      <div>
      <h2 className="text-2xl font-bold mb-4">Batch Claims</h2>
      </div>
       {/* Moved to the top */}
      {/* <div className="mb-8">
        <div>
          <Forminput />
        </div>
        <div className="col">
          <h2 className="text-xl font-semibold mb-4">Upload Document</h2>
          <div style={{ marginLeft: "-20px" }}>
            <Loader />
          </div>
          <div className="flex justify-between mt-10">
            <CustomButton /> 
            <CustomButton1 /> 
          </div>
        </div>
      </div> */}
   <   BatchClaims/>
    </div>
  );
  
}
