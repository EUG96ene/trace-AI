"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";

interface BatchDocumentInputProps {
  onBatchNameChange: (newName: string) => void;
}

export default function Batchname({ onBatchNameChange }: BatchDocumentInputProps): React.JSX.Element {
  const [batchName, setBatchName] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newName = e.target.value;
    setBatchName(newName);
    if (typeof onBatchNameChange === 'function') {
      onBatchNameChange(newName);
    }
  };

  return (
    <div>
      <label htmlFor="batchName" className="block font-medium mb-2">
        Batch Name
      </label>
      <Input
        type="text"
        id="batchName"
        name="batchName"
        value={batchName}
        onChange={handleChange}
        placeholder="Enter batch name"
        style={{ width: '12rem', left: 'calc(100% - 9rem)' }}
      />
    </div>
  );
}