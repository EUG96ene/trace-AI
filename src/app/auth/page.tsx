import Image from "next/image";
import Link from "next/link";
import CICLogo from '/public/aar-insurance-high-res-logo.png';
import Background from '/public/Background.jpg';
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { UserAuthForm } from "@/components/auth/UserAuth";


export default function AuthenticationPage() {
  return (
    <div className="h-[100vh]">
      <div className="container relative hidden h-[100vh] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/examples/authentication"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0" style={{ 
                  backgroundImage: `url(${Background.src})`,
                  backgroundSize: 'cover',       // Adjust to fit container
                  backgroundPosition: 'center',  // Adjust to position the image
                  backgroundRepeat: 'no-repeat' // Ensure the image does not repeat
}} />
        <div className="relative z-20 flex items-center text-lg font-medium">
        <Image
             src={CICLogo}
               alt="Logo"
                width={300}  // Adjust width as necessary
               height={300} // Adjust height as necessary
                 className="mr-2 h-25 w-20 object-cover"/>
</div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
            <p className="text-lg" style={{ color: '#F78930' }}>
                   &ldquo;Safe Guarding Your Health and Wealth&rdquo;
</p>

              {/* <footer className="text-sm">Sofia Davis</footer> */}
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              
            </div>
            <UserAuthForm />
            
          </div>
        </div>
      </div>
    </div>
  );
}
