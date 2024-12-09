"use client"
import Profile1 from "@/components/Updateprofile";
import Account2 from "@/components/Accountdetails";

export default function profile() {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Profile1/>
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Account2/>
            </div>
  </div>
  )
}
