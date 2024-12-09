"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { getSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import {
  FilePlus2,
  FileStack,
  Phone,
  LogOut,
  User,
  Home,
  FileText,
} from "lucide-react";
import UserItem from "./UserItem";
import {
  Command,
  CommandGroup,
  CommandSeparator,
  CommandItem,
  CommandList,
} from "./ui/command";
import { removeAuthToken } from "@/utils/helpers/authHelpers";

interface MenuItem {
  link: string;
  icon: JSX.Element;
  text: string;
  onClick?: () => void;
}

interface MenuGroup {
  group: string;
  items: MenuItem[];
}

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [menuList, setMenuList] = useState<MenuGroup[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({ redirect: false });
    removeAuthToken();
    router.push("/portal/auth");
    setLoading(false);
  };

  useEffect(() => {
    const fetchSession = async () => {
      const session = await getSession();
      if (session?.user?.user?.category === "Provider") {
        setMenuList([
          {
            group: "General",
            items: [
              {
                link: "/portal/dashboard/client",
                icon: <Home className="h-5 w-5" />,
                text: "Home",
              },
              {
                link: "/portal/dashboard/client/Claimsmanagement",
                icon: <FileStack className="h-5 w-5" />,
                text: "Claims Management",
              },
            ],
          },
          {
            group: "Setting",
            items: [
              {
                link: "/portal/dashboard/client/support",
                icon: <Phone className="h-5 w-5" />,
                text: "Support",
              },
              {
                link: "/portal/dashboard/client/Userdetails",
                icon: <User className="h-5 w-5" />,
                text: "Account",
              },
              {
                link: "#",
                icon: <LogOut className="h-5 w-5" />,
                text: "Logout",
                onClick: handleSignOut,
              },
            ],
          },
        ]);
      } else {
        setMenuList([
          {
            group: "General",
            items: [
              // {
              //   link: "/portal/dashboard/admin",
              //   icon: <Home className="h-5 w-5" />,
              //   text: "Home",
              // },
              {
                link: "/portal/dashboard/admin/claim-approvals",
                icon: <FileStack className="h-5 w-5" />,
                text: "Claim Approvals",
              },
              // {
              //   link: "/portal/dashboard/admin/claims-management",
              //   icon: <FileText className="h-5 w-5" />,
              //   text: "Audit Trail",
              // },
            ],
          },
          {
            group: " Account Management",
            items: [
              {
                link: "/portal/dashboard/admin/account-settings",
                icon: <User className="h-5 w-5" />,
                text: "Account Settings",
              },
              {
                link: "/portal/dashboard/admin/user-management",
                icon: <User className="h-5 w-5" />,
                text: "User Management",
              },
              {
                link: "/portal/dashboard/admin/provider-management",
                icon: <Phone className="h-5 w-5" />,
                text: "Provider Management",
              },
              {
                link: "/portal/dashboard/admin/configuration",
                icon: <FilePlus2 className="h-5 w-5" />,
                text: "Configuration",
              },
              {
                link: "#",
                icon: <LogOut className="h-5 w-5" />,
                text: "Logout",
                onClick: handleSignOut,
              },
            ],
          },
        ]);
      }
    };

    fetchSession();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div
      className="fixed flex gap-4 border-r min-h-screen p-4"
      style={{ width: isOpen ? "300px" : "60px" }}
    >
      <div className={`flex flex-col gap-4 w-full ${isOpen ? "" : "hidden"}`}>
        <div>
          <UserItem />
        </div>
        <div className="grow">
          <Command style={{ overflow: "visible" }}>
            <CommandList style={{ overflow: "visible" }}>
              {menuList.map((menu, key) => (
                <CommandGroup key={key} heading={menu.group}>
                  {menu.items.map((option, optionKey) => (
                    <div
                      key={optionKey}
                      style={{ cursor: "pointer" }}
                      onClick={option.onClick}
                    >
                      <Link href={option.link}>
                        <CommandItem className="flex gap-2 items-center">
                          {option.icon}
                          <span>{option.text}</span>
                        </CommandItem>
                      </Link>
                    </div>
                  ))}
                </CommandGroup>
              ))}
              <CommandSeparator />
            </CommandList>
          </Command>
        </div>
      </div>
    </div>
  );
}
