// ProviderDetail.tsx

"use client";
import * as React from "react";
import { useParams } from "next/navigation";
import { axios } from "@/utils/axios";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

const ProviderDetail = () => {
  const { id } = useParams();
  const [provider, setProvider] = React.useState(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchProviderDetails = async () => {
      try {
        const response = await axios.get(`/providers/${id}`);
        setProvider(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch provider details:", error);
        setLoading(false);
      }
    };

    fetchProviderDetails();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!provider) {
    return <div>No provider found.</div>;
  }

  return (
    <div className="flex justify-center">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle>{provider.providerName}</CardTitle>
          <CardDescription>Provider Details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div>
              <strong>Provider Code:</strong> {provider.providerCode}
            </div>
            <div>
              <strong>Email:</strong> {provider.email}
            </div>
            <div>
              <strong>Address:</strong> {provider.address}
            </div>
            <div>
              <strong>Contact Number:</strong> {provider.contactNumber}
            </div>
            <div>
              <strong>Onboarded:</strong> {provider.onboarded ? "Yes" : "No"}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProviderDetail;
