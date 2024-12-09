"use client";

import Link from "next/link";
import { signIn, SignInResponse } from "next-auth/react";
import { useRouter } from "next/navigation";
import { getSession } from "next-auth/react";
import { useState } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast, Toaster } from "react-hot-toast";
import { cn } from "@/lib/utils";
import { Icons } from "@/components/icons/icons";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import useStatus from "@/hooks/useStatus";
import { useAuth } from "@/context/AuthContext";
import { setAuthToken, setUser } from "@/utils/helpers/authHelpers";
import { User } from "@/utils/shared/types";

const schema = z.object({
  email: z.string().min(1, "Required field").email("That's not a valid email"),
  password: z.string().min(8, "Required field"),
});

type FormValues = z.infer<typeof schema>;

export function UserAuthForm() {
  const router = useRouter();
  const { setStatus, isLoading } = useStatus();
  const { setCurrentUser } = useAuth();
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });

  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit = async (data: FormValues) => {
    try {
      console.log("Submitting form with data:", data);

      const res = await signIn("credentials", {
        redirect: false,
        email: data.email,
        password: data.password,
      });
      console.log("signIn response:", res);

      if (res) {
        const apiResponse = res as SignInResponse;
        if (apiResponse.error) {
          setStatus("rejected");
          toast.error(apiResponse.error, { position: "top-right" });
        } else if (apiResponse.url) {
          const session = (await getSession()) as { user?: User };
          setUser(session?.user);
          console.log("auth_token", session);
          if (session?.user) {
            setCurrentUser(session?.user?.user);
            setAuthToken(session.user?.auth_token);

            toast.success("User login successful", { position: "top-right" });

            switch (session?.user?.user?.category) {
              case "CIC":
                router.push("/dashboard/admin/claim-approvals");
                break;
              case "Provider":
                router.push("/dashboard/client");
                break;
              default:
                router.push("/dashboard/admin/claim-approvals");
                break;
            }
          }
        }
      }
    } catch (error) {
      console.error("Error during form submission:", error);
      toast.error("Error during form submission");
    }
  };

  return (
    <>
      <Toaster />
      <div className={cn("grid gap-6")}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="mx-auto grid w-[350px] gap-6"
        >
          <div className="grid gap-2 text-center">
            <h1 className="text-5xl font-bold" style={{ color: "red" }}>
              Login
            </h1>
          </div>
          <div className="grid gap-4">
            <div className="grid gap-4">
              <Label htmlFor="email" style={{ fontSize: "1.25rem" }}>
                Email
              </Label>
              <input
                id="email"
                type="text"
                placeholder="hello@example.com"
                {...register("email")}
                style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
                className={errors.email ? "border-red-500" : ""}
              />
              {errors.email && (
                <span className="text-red-500 text-sm">
                  {errors.email.message}
                </span>
              )}
            </div>
            <div className="grid gap-4 relative">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" style={{ fontSize: "1.25rem" }}>
                  Password{" "}
                </Label>
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                {...register("password")}
                style={{ width: "100%", padding: "0.5rem", fontSize: "1rem" }}
                className={`${errors.password ? "border-red-500" : ""}`}
              />
              {errors.password && (
                <span className="text-red-500 text-sm">
                  {errors.password.message}
                </span>
              )}
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute right-2 top-2"
                aria-label="Toggle Password Visibility"
              >
                <Image
                  height={15}
                  width={15}
                  src="/portal/icons/eye.svg"
                  alt={showPassword ? "Hide Password" : "Show Password"}
                />
              </button>
            </div>
            {/* <Link href="/forgot-password" className="text-sm text-red-500 underline">
              Forgot your password?
            </Link> */}
            <Button
              type="submit"
              disabled={isLoading}
              style={{ backgroundColor: "red" }}
            >
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Login"
              )}
            </Button>
          </div>
        </form>
      </div>
    </>
  );
}
