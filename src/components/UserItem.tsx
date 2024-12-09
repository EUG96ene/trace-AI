'use client';
import { useEffect, useState } from "react";
import { getSession } from "next-auth/react";
export default function UserItem() {
  const [username, setUserName] = useState('')
  const [userRole, setUserRole] = useState('')

  useEffect(() => {
    const fetchUserAccount = async () => {
      const session = await getSession();
      const userAccountName = session?.user?.user?.name
      const userRole = session?.user?.user?.role
      setUserName(userAccountName)
      setUserRole(userRole)
    
    }
    fetchUserAccount()
  }, [])

  return <div className="flex items-center justify-between gap-2 border rounded-[8px] p-2">
    <div className="avatar rounded-full min-h-10 min-w-10 bg-red-500 text-white font-[700] flex items-center justify-center">
      <p>EO</p>
    </div>
    <div className="grow">
      <p className="text-[16px] font-bold">{username}</p>
      <p className="text-[12px] text-neutral-500">{userRole} </p>
    </div>
  </div>;
}