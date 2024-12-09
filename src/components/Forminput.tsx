
"use client"

import React, { useState } from "react";
import { Input } from "@/components/ui/input";


export default function ClaimForm() {
  // State to manage form data
  const [formData, setFormData] = useState({
    providerName: "",
    providerCode: "",
  });

  // Function to handle form data changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Function to handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    // Add your submission logic here
    console.log(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <h2 className="text-lg font-semibold">Insurance Information</h2>
          <div>
            <label>Provider Name</label>
            <Input
              type="text"
              name="providerName"
              value={formData.providerName}
              onChange={handleChange}
              required
              style={{ width: '25rem', left: 'calc(100% - 11rem)' }}
            />
          </div>
          <div>
            <label>Provider Code</label>
            <Input
              type="text"
              name="providerCode"
              value={formData.providerCode}
              onChange={handleChange}
              required
              style={{ width: '15rem', left: 'calc(100% - 5rem)' }}
            />
          </div>
        </div>
      </div>
    </form>
  );
}
