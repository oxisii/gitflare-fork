import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { PlusIcon } from "lucide-react";
import { getSessionOptions } from "@/api/session";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import * as m from "@/paraglide/messages";
import { getLocale, setLocale } from "@/paraglide/runtime";
import { Skeleton } from "./ui/skeleton";

export function UserProfileButton() {
  const locale = getLocale();
  const { data, isLoading } = useQuery(getSessionOptions);

  // here we explicitly check for undefined and null
  // because when query is loading, data is undefined,
  // and the user is not logged in, data is null (from better-auth)

  if (isLoading || data === undefined) {
    return <Skeleton className="h-10 w-10 rounded-full" />;
  }

  if (!isLoading && data === null) {
    return (
      <Link className={buttonVariants({ variant: "outline" })} to="/login">
        {m.nav_sign_in()}
      </Link>
    );
  }

  const user = data?.user;

  return (
    <div className="flex items-center gap-2 sm:gap-4">
      <Link
        className={cn(
          buttonVariants({ variant: "outline", size: "icon" }),
          "sm:hidden"
        )}
        to="/new"
      >
        <PlusIcon />
        <span className="sr-only">{m.nav_new()}</span>
      </Link>
      <Link
        className={cn(
          buttonVariants({ variant: "outline" }),
          "hidden sm:inline-flex"
        )}
        to="/new"
      >
        <PlusIcon /> {m.nav_new()}
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="relative h-10 w-10 rounded-full" variant="ghost">
            <Avatar className="h-10 w-10">
              <AvatarImage
                alt={`@${user?.username}`}
                src={`https://api.dicebear.com/9.x/notionists/svg?seed=${user?.username}&scale=150&backgroundType=solid,gradientLinear&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf`}
              />
              <AvatarFallback>
                {user?.name
                  .split(" ")
                  .map((w) => w.at(0))
                  .join("")}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="font-medium text-sm leading-none">{user?.name}</p>
              <p className="text-muted-foreground text-xs leading-none">
                {user?.username}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link to="/dashboard">{m.nav_dashboard()}</Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link params={{ owner: user?.username ?? "" }} to="/$owner">
              {m.nav_profile()}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings">{m.nav_settings()}</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuLabel className="text-muted-foreground text-xs">
            {m.settings_language()}
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup
            onValueChange={(value) => {
              if (value === "en" || value === "zh") {
                setLocale(value);
              }
            }}
            value={locale}
          >
            <DropdownMenuRadioItem value="zh">
              {m.settings_language_zh()}
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="en">
              {m.settings_language_en()}
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={async () => {
              await authClient.signOut();
              window.location.href = "/";
            }}
          >
            {m.nav_sign_out()}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
