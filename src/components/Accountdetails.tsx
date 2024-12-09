import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";

export default function SettingsPage() {
  return (
    <div>
      <main className="flex min-h-[calc(100vh - 8rem)] flex-1 flex-col gap-4 bg-grey/40 p-4 md:gap-8 md:p-10">
        <div className="mx-auto grid w-full max-w-[calc(100vw - 8rem)] gap-2">
          <h1 className="text-3xl font-semibold">Account</h1>
        </div>
        <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav className="grid gap-4 text-sm text-muted-foreground" x-chunk="dashboard-04-chunk-0">
          
            <Link href="/portal/dashboard/client/Userdetails">Profile</Link>
          </nav>
          </div>
      </main>
    </div>
  );
}
