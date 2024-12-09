
import ReturnedClaims from "@/components/Cards/Return";
import SubmittedClaims from "@/components/Cards/Submitted";
import ApprovedClaims from "@/components/Cards/Approved";
import Combobox from "@/components/Combox/Combobox";
import BatchClaims from "@/components/Client/BatchClaimstable";
import IndividualClaims2 from "@/components/Individualclaims1";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

import Link from "next/link";


export default function Home() {
  return (
    <div>
    <div className="flex justify-center x-1">
          <div className="grid-cols-5 w-80 h-40 mr-4">
             <ReturnedClaims/>
           </div>
          <div className="grid-cols-5 w-80 h-40 ml-4">
           <SubmittedClaims />
            </div>
            <div className="grid-cols-5 w-80 h-40 ml-4">
           <ApprovedClaims />
            </div>
           </div>
           <span className="mx-4"></span> 
           <div className="flex justify-center x-1">
       <Link href="/dashboard/client/NewClaimUpload">
          <Button size="sm" className="gap-1 bg-red-400">
          <PlusCircle className="h-4 w-4 text-black" />
           <span className="text-lg text-black">Create A New Claim</span>
            </Button>
           </Link>
        <span className="mx-4"></span> {/* Space between the links */}
           <Link href="/dashboard/client/Batchclaimsupload">
           <Button size="sm" className="gap-1 bg-red-400">
           <PlusCircle className="h-4 w-4 text-black" />
           <span className="text-lg text-black">Create A Batch Claim</span>
          </Button>
            </Link>
              </div>


    <div style={{ marginTop: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Batch Claims</h2>
      </div>
      <div>
        <Combobox />
      </div>
      <div>
        <BatchClaims />
      </div>
      <div style={{ marginTop: '20px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Individual Claim</h2>
      </div>
      <div>
        <Combobox />
      </div>
      <div>
        <IndividualClaims2 />
      </div>
    </div>
  );
}