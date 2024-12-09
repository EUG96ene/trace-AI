
"use client"

import React from 'react';
import Email from "@/components/Cards/Email";
import Contact from "@/components/Cards/Contact";
import Location from "@/components/Cards/Location";
import Website from "@/components/Cards/Website";
import Support1 from "@/components/Support";
import Export2 from "@/components/Pointer";

export default function Support() {
  return (
    <div className="flex justify-between items-start">
      <div className="flex flex-col gap-4">
        <div className="w-64">
          <Email />
        </div>
        <div className="w-64">
          <Contact />
        </div>
        <div className="w-64">
          <Location />
        </div>
        <div className="w-64">
          <Website />
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '70vh' }}>
  <Export2/>
</div>

      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '45px', marginRight: '200px' }} >
        <Support1 />
      </div>
    </div>
  );
}
