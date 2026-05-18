"use client";

import * as React from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  LayoutDashboardIcon,
  VideoIcon,
  BotIcon,
  StarIcon,
  LogOutIcon,
  SearchIcon,
  PlusIcon,
  HelpCircleIcon,
  UserIcon,
  ShieldCheckIcon,
  CreditCardIcon,
  CommandIcon,
  SparklesIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";

export function DashboardCommand() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => void) => {
    setOpen(false);
    command();
  }, []);

  const handleLogout = async () => {
    try {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
            router.push("/sign-in");
            toast.success("Signed out successfully");
          },
        },
      });
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className={cn(
          "group relative flex items-center w-full max-w-md h-10 px-4",
          "bg-white border border-gray-200 rounded-xl shadow-sm",
          "hover:border-green-500/50 hover:shadow-md hover:bg-gray-50/50 transition-all duration-200",
          "cursor-pointer outline-none ring-offset-background focus-visible:ring-2 focus-visible:ring-green-500/20",
        )}
      >
        <SearchIcon className="mr-3 h-4 w-4 text-gray-400 group-hover:text-green-600 transition-colors" />
        <span className="text-sm text-gray-400 group-hover:text-gray-500 transition-colors flex-1 text-left">
          Search or type a command...
        </span>
        <Kbd className="bg-gray-50 border-gray-200 text-[10px] h-5 px-1.5 flex items-center gap-0.5 shadow-xs group-hover:bg-white transition-colors">
          <CommandIcon className="size-2.5" />
          <span>K</span>
        </Kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search Nexa AI..." />
        <CommandList>
          <CommandEmpty className="py-12 flex flex-col items-center justify-center gap-2">
            <div className="size-12 rounded-full bg-green-50 flex items-center justify-center">
              <SparklesIcon className="size-6 text-green-600 opacity-20" />
            </div>
            <p className="text-sm font-medium text-muted-foreground">
              No matches found for your query.
            </p>
          </CommandEmpty>

          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => router.push("/"))}>
              <LayoutDashboardIcon className="mr-2 h-4 w-4 text-green-600" />
              <span>Dashboard</span>
              <CommandShortcut>⌘D</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/meetings"))}
            >
              <VideoIcon className="mr-2 h-4 w-4 text-green-600" />
              <span>Meetings</span>
              <CommandShortcut>⌘M</CommandShortcut>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/agents"))}
            >
              <BotIcon className="mr-2 h-4 w-4 text-green-600" />
              <span>AI Agents</span>
              <CommandShortcut>⌘A</CommandShortcut>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Actions">
            <CommandItem
              onSelect={() =>
                runCommand(() => toast.success("Feature coming soon!"))
              }
            >
              <PlusIcon className="mr-2 h-4 w-4 text-green-600" />
              <span>New Meeting</span>
            </CommandItem>
            <CommandItem
              onSelect={() => runCommand(() => router.push("/upgrade"))}
            >
              <StarIcon className="mr-2 h-4 w-4 text-amber-500 animate-pulse" />
              <span>Upgrade to Pro</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Account">
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/settings?tab=profile"))
              }
            >
              <UserIcon className="mr-2 h-4 w-4 text-green-600" />
              <span>Profile Settings</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/settings?tab=billing"))
              }
            >
              <CreditCardIcon className="mr-2 h-4 w-4 text-green-600" />
              <span>Billing & Plan</span>
            </CommandItem>
            <CommandItem
              onSelect={() =>
                runCommand(() => router.push("/settings?tab=security"))
              }
            >
              <ShieldCheckIcon className="mr-2 h-4 w-4 text-green-600" />
              <span>Security</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Support">
            <CommandItem
              onSelect={() =>
                runCommand(() =>
                  window.open("https://docs.nexaai.com", "_blank"),
                )
              }
            >
              <HelpCircleIcon className="mr-2 h-4 w-4 text-blue-500" />
              <span>Documentation</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(handleLogout)}>
              <LogOutIcon className="mr-2 h-4 w-4 text-red-500" />
              <span className="text-red-500 font-semibold">Sign Out</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
