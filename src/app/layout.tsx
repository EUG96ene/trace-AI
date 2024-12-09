"use client";

import Header from "@/components/Header";
import Sidebar from "@/components/Sidebar";
import { Inter } from "next/font/google";
import "./globals.css";
import { SessionProvider, useSession } from "next-auth/react";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import dynamic from "next/dynamic";
import Preloader from "@/shared/Preloaders";
import { axiosClient } from "@/utils/axios";
import { useEffect } from "react";
import { getAuthToken } from "@/utils/helpers/authHelpers";
import AuthenticationPage from "./auth/page";
import { useRouter } from "next/navigation";
import { pdfjs } from 'react-pdf';

pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>
          <AuthProvider>
            <MainLayout>{children}</MainLayout>
          </AuthProvider>
        </SessionProvider>
      </body>
    </html>
  );
}

function MainLayout({ children }: { children: React.ReactNode }) {
  const { status, data: session } = useSession();
  const { currentUser, setCurrentUser } = useAuth();
  const authtoken = getAuthToken();
  const router = useRouter();

  useEffect(() => {
    if (session && session?.user) {
      setCurrentUser(session?.user);
      axiosClient(authtoken);
    }
  }, [session, setCurrentUser, authtoken]);

  useEffect(() => {
    if (status === "authenticated" && !session) {
      router.push("/portal/auth");
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <Preloader />;
  }

  if (status === "authenticated" && session?.user) {
    return <AuthenticatedLayout>{children}</AuthenticatedLayout>;
  }

  return <UnauthenticatedLayout />;
}

function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`${inter.className} flex items-start justify-between`}>
      <Sidebar />
      <main className="grid w-full h-full pl-[300px]">
        <Header />
        <div className="p-8">{children}</div>
      </main>
    </div>
  );
}

function UnauthenticatedLayout() {
  return <AuthenticationPage />;
}
