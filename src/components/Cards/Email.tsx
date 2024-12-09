"use client"
import React from 'react';
import { Mail } from "lucide-react"; // Assuming "Check" is the correct component name
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import HoverCardDemo1 from "@/components/Hover";

export default function Email() {
  return (
    <Card x-chunk="dashboard-01-chunk-0">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-lg font-medium text-red-500">Email</CardTitle>
       <Mail className="h-4 w-4 text-muted-foreground" /> {/* Assuming "Check" is the correct component */}
      </CardHeader>
      <CardContent>
        <div className="flex justify-center">
        <HoverCardDemo1/>
        </div>
        
      </CardContent>
    </Card>
  );
}
