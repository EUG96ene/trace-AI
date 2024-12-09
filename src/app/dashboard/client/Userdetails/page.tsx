"use client"
import Profile1 from "@/components/Updateprofile";
import Account2 from "@/components/Accountdetails";
import Userdetails from "@/components/userdetails";

export default function profile() {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start' }}>
    <div >
      <Account2/>
    </div>
    <div > {/* Decreased margin */}
      <div style={{ marginBottom: '100px' }}> {/* Decreased margin */}
        {/* Optional content for spacing */}
      </div>
      <div>
        <Userdetails/>
      </div>
    </div>
  </div>
  

  



  )
}
