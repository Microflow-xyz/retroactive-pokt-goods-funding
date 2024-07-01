import type { ReactNode, PropsWithChildren } from "react";
import { useAccount } from "wagmi";

import Header from "~/components/Header";
import { BaseLayout, type LayoutProps } from "./BaseLayout";
import { getAppState } from "~/utils/state";
import { config } from "~/config";
import { useSession } from "next-auth/react";
import { useIsVoter } from "~/hooks/useIsVoter";

type Props = PropsWithChildren<
  {
    sidebar?: "left" | "right";
    sidebarComponent?: ReactNode;
  } & LayoutProps
>;
export const Layout = ({ children, ...props }: Props) => {
  const { address } = useAccount();
  const navLinks = [
    {
      href: "/",
      children: "RetroPGF",
    },

    {
      href: "/projects",
      children: "Projects",
    },
  ];

  const isVoter = useIsVoter();

  if (getAppState() === "RESULTS") {
    navLinks.push({
      href: "/stats",
      children: "Stats",
    });
  }

  if (config.admins.includes(address!)) {
    navLinks.push(
      ...[
        {
          href: "/applications",
          children: "Applications",
        },
        // {
        //   href: "/voting",
        //   children: "#",
        // },
        // {
        //   href: "/distribute",
        //   children: "Distribute",
        // },
        // {
        //   href: "/builderIdeas",
        //   children: "Builder Ideas",
        // },
        {
          href: "/info",
          children: "Key Info",
        },
      ],
    );
  } else
    navLinks.push(
      ...[
        // {
        //   href: "/builderIdeas",
        //   children: "Builder Ideas",
        // },
        {
          href: "/info",
          children: "Key Info",
        },
      ],
    );

  navLinks.push({
    href: "/voting",
    children: "Voting Tally",
  });

  return (
    <BaseLayout
      {...props}
      header={<Header address={address} navLinks={navLinks} />}
    >
      {children}
    </BaseLayout>
  );
};

export function LayoutWithBallot(props: Props) {
  const { address } = useAccount();
  const { data: session } = useSession();
  return <Layout sidebar={props.sidebar} {...props} />;
}
