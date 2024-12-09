"use client"
import { useEffect, useState } from 'react';
import { cn } from "@/lib/utils";
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Toast } from '@/components/ui/toast';
import { Icons } from "@/components/icons/icons";
import authService from "@/services/auth.service";

export function ResetPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { token } = router.query || {};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const response = await authService.resetPassword({ token, newPassword }); // Pass the token to the resetPassword function

      if (response.status === 200) {
        setSuccess(true);
        setError(null);
      } else {
        const error = await response.json();
        setError(error.message);
      }
    } catch (error) {
      setError('An error occurred while resetting your password');
    }
  }

  return (
    <div className={cn("grid gap-6")}>
      <form onSubmit={handleSubmit}>
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <h1 className="text-3xl font-bold">Reset Password</h1>
          </div>
          {error && <p className="text-red-500">{error}</p>}
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="newPassword">Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>
            <Button disabled={isLoading}>
              {isLoading ? (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                "Submit"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
