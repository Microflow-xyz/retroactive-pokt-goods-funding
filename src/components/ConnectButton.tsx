import Link from "next/link";
import { type ComponentPropsWithRef } from "react";
import { useEnsAvatar, useEnsName } from "wagmi";
import { getAddress, type Address } from "viem";
import { normalize } from "viem/ens";
import { ConnectButton as RainbowConnectButton } from "@rainbow-me/rainbowkit";
import { createBreakpoint } from "react-use";
import { ListChecks } from "lucide-react";
import { UserRound } from "lucide-react";

import { Button } from "./ui/Button";
import { Chip } from "./ui/Chip";
import { EligibilityDialog } from "./EligibilityDialog";
import { useLayoutOptions } from "~/layouts/BaseLayout";
import { getAppState, type AppState } from "~/utils/state";
import { useIsAdmin } from "~/hooks/useIsAdmin";

const useBreakpoint = createBreakpoint({ XL: 1280, L: 768, S: 350 });

export const ConnectButton = () => {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "S";
  const state = getAppState();

  return (
    <RainbowConnectButton.Custom>
      {({
        account,
        chain,
        openAccountModal,
        openChainModal,
        openConnectModal,
        mounted,
        authenticationStatus,
      }) => {
        const ready = mounted && authenticationStatus !== "loading";
        const connected =
          ready &&
          account &&
          chain &&
          (!authenticationStatus || authenticationStatus === "authenticated");

        return (
          <div
            {...(!mounted && {
              "aria-hidden": true,
              style: {
                opacity: 0,
                pointerEvents: "none",
                userSelect: "none",
              },
            })}
          >
            {(() => {
              if (!connected) {
                return (
                  <div className="flex flex-row-reverse items-center gap-2">
                    <Button
                      suppressHydrationWarning
                      onClick={openConnectModal}
                      className="rounded-full"
                      variant="primary"
                    >
                      {isMobile ? "Connect" : "Connect wallet"}
                    </Button>
                    {state === "APPLICATION" && (
                      <Chip
                        className="gap-2 px-4 md:px-12 md:leading-[1.875rem]"
                        as={Link}
                        href={"/applications/new"}
                      >
                        Apply
                      </Chip>
                    )}
                  </div>
                );
              }

              if (chain.unsupported) {
                return <Chip onClick={openChainModal}>Wrong network</Chip>;
              }

              return (
                <ConnectedDetails
                  account={account}
                  openAccountModal={openAccountModal}
                  isMobile={isMobile}
                  state={state}
                />
              );
            })()}
          </div>
        );
      }}
    </RainbowConnectButton.Custom>
  );
};

const ConnectedDetails = ({
  openAccountModal,
  account,
  isMobile,
  state,
}: {
  account: { address: string; displayName: string };
  openAccountModal: () => void;
  isMobile: boolean;
  state: AppState;
}) => {
  const isAdmin = useIsAdmin();

  const { eligibilityCheck, showBallot } = useLayoutOptions();
  return (
    <div>
      <div className="flex gap-2 text-white">
        {state === "VOTING" || isAdmin ? (
          <>
            {/* {!showBallot ? null : ballot?.publishedAt ? (
              <Chip>Already submitted</Chip>
            ) : ( */}
            <Chip className="gap-2" as={Link} href={"/ballot"}>
              {isMobile ? <ListChecks className="size-4" /> : `View Ballot`}
            </Chip>
            {/* )} */}
          </>
        ) : (
          state === "APPLICATION" && (
            <Chip
              className="gap-2 px-4 md:px-12"
              as={Link}
              href={"/applications/new"}
            >
              Apply
            </Chip>
          )
        )}

        <UserInfo
          onClick={openAccountModal}
          address={getAddress(account.address)}
        >
          {isMobile ? null : account.displayName}
        </UserInfo>
        {eligibilityCheck && <EligibilityDialog />}
      </div>
    </div>
  );
};

const UserInfo = ({
  address,
  children,
  ...props
}: { address: Address } & ComponentPropsWithRef<typeof Chip>) => {
  const ens = useEnsName({ address, chainId: 1 });
  const name = ens.data ? normalize(ens.data) : "";
  const avatar = useEnsAvatar({ name, chainId: 1 });

  return (
    <Chip className=" min-h-10 min-w-10 gap-2" {...props}>
      <div className="h-4 w-4 overflow-hidden rounded-full md:h-6 md:w-6">
        {avatar.data ? (
          <img width={24} height={24} alt={name} src={avatar.data} />
        ) : (
          <div className="flex h-full items-center justify-center rounded-full ">
            <UserRound
              className="hover:stroke-primary-dark"
              color="#FFFFFF"
              strokeWidth={1.5}
            />
          </div>
        )}
      </div>
      {children}
    </Chip>
  );
};
