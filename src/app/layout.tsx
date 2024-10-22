import * as React from "react";
import { AppProvider } from "@toolpad/core/nextjs";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v14-appRouter";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SearchIcon from "@mui/icons-material/Search";
import type { Navigation } from "@toolpad/core";
import { SessionProvider, signIn, signOut } from "next-auth/react";
import { auth } from "./auth";
import { Roboto } from "next/font/google";
import { ThemeProvider } from "@mui/material/styles";
import theme from "../theme";
import { GroupAdd, Settings, SupervisedUserCircleOutlined } from "@mui/icons-material";

const roboto = Roboto({
  weight: ["300", "400", "500", "700"],
  subsets: ["latin"],
  display: "swap",
  variable: "--font-roboto",
});

const NAVIGATION: Navigation = [
  {
    kind: "header",
    title: "Main items",
  },
  {
    title: "Dashboard",
    icon: <DashboardIcon />,
  },
  {
    segment: "search",
    title: "Search",
    icon: <SearchIcon />,
  },
  {
    segment: "create",
    title: "Create",
    icon: <GroupAdd />,
  },
  {
    kind: "divider",
  },
  {
    kind: "header",
    title: "User Management",
  },
  {
    title: "Profile",
    segment: "profile",
    icon: <SupervisedUserCircleOutlined />
  },
  {
    title: "Settings",
    segment: "settings",
    icon: <Settings />
  },
];

const BRANDING = {
  title: "LLDAP Administration",
};

const AUTHENTICATION = {
  signIn,
  signOut,
};

export default async function RootLayout(props: { children: React.ReactNode }) {
  const session = await auth();

  return (
    <html lang="en" data-toolpad-color-scheme="light">
      <body className={roboto.variable}>
        <SessionProvider session={session}>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
              <AppProvider
                navigation={NAVIGATION}
                branding={BRANDING}
                session={session}
                authentication={AUTHENTICATION}
              >
                {props.children}
              </AppProvider>
          </AppRouterCacheProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
