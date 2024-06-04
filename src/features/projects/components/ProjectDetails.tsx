import { type ReactNode } from "react";
import Link from "next/link";
import { X, Check, ExternalLinkIcon, Globe, Mail } from "lucide-react";
import { ProjectBanner } from "~/features/projects/components/ProjectBanner";
import { ProjectAvatar } from "~/features/projects/components/ProjectAvatar";
import { Heading } from "~/components/ui/Heading";
import ProjectContributions from "./ProjectContributions";
import ProjectImpact from "./ProjectImpact";
// import { NameENS } from "~/components/ENS";
import { suffixNumber } from "~/utils/suffixNumber";
import { type AppState } from "~/utils/state";
import { useProjectMetadata } from "../hooks/useProjects";
import { type Attestation } from "~/utils/fetchAttestations";
import { LinkBox } from "./LinkBox";
import { Button } from "~/components/ui/Button";
import { useProfileWithMetadata } from "~/hooks/useProfile";
import { config } from "~/config";

export default function ProjectDetails({
  attestation,
  action,
  address,
  state,
  isAdmin = false,
}: {
  action: ReactNode;
  attestation?: Attestation;
  address?: string;
  state?: AppState;
  isAdmin: boolean;
}) {
  const metadata = useProjectMetadata(attestation?.metadataPtr);
  const profile = useProfileWithMetadata(attestation?.recipient);
  const {
    bio,
    websiteUrl,
    // payoutAddress,
    fundingSources,
  } = metadata.data ?? {};
  const voters = config?.voters;
  return (
    <div className="relative">
      <div className="overflow-hidden">
        <ProjectBanner size="lg" profileId={attestation?.recipient} />
      </div>
      <div className=" mb-8 flex flex-col items-baseline md:mb-16 md:flex-row md:items-center md:gap-4">
        <ProjectAvatar
          rounded="full"
          size={"lg"}
          className="-mt-20 ml-2 md:ml-8"
          profileId={attestation?.recipient}
        />

        <div>
          <div className="flex flex-col items-baseline p-2 md:p-0">
            <p className="break-words ">{profile?.data?.name}</p>
            <p className="break-words ">{attestation?.recipient}</p>
            {websiteUrl && (
              <Link
                href={
                  websiteUrl.startsWith("https://")
                    ? websiteUrl
                    : `https://${websiteUrl}`
                }
                target="_blank"
                className="m-2 flex items-center justify-between gap-1 break-words  hover:text-primary-dark md:m-0"
              >
                <Globe className=" h-4 w-4" />
                <span>Website</span>
                <ExternalLinkIcon className=" h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
      <div className="flex flex-col-reverse items-start justify-between gap-5 md:flex-row md:items-center md:gap-4">
        <div className="flex flex-col items-start justify-between gap-2">
          <div className="flex items-end gap-3  ">
            <h1 className="text-2xl font-bold">{attestation?.name}</h1>
            {metadata?.data?.impactCategory && (
              <span className=" rounded-full bg-gray-200 px-3 py-1 text-sm transition dark:border dark:border-outline-dark dark:bg-transparent dark:text-outline-dark">
                {metadata?.data?.impactCategory}
              </span>
            )}
          </div>
          <p className="break-words text-justify text-lg ">{bio}</p>
          {(isAdmin || voters?.some((item) => item === address)) &&
            metadata?.data?.email && (
              <p className="flex items-center gap-2">
                <Mail className="h-4 w-4" strokeWidth={1.5} />
                {metadata?.data?.email}
              </p>
            )}
        </div>
        {action}

        {address &&
          address === attestation?.attester &&
          state &&
          state === "APPLICATION" && (
            <Button
              as={Link}
              href={`/projects/${attestation?.id}/edit`}
              variant="outline"
            >
              Edit submitted project
            </Button>
          )}
      </div>
      {(isAdmin || voters?.some((item) => item === address)) && (
        <p className="mt-6 flex items-center gap-2">
          {metadata?.data?.isDAOVoters ? (
            <span className=" rounded-full border border-[#00B669] p-1 ">
              <Check className="h-4 w-4" color="#00B669" strokeWidth={1.5} />
            </span>
          ) : (
            <span className=" rounded-full border border-[#DD0035] p-1">
              <X className="h-4 w-4" color="#DD0035" strokeWidth={1.5} />
            </span>
          )}
          Are you or any employees, contractors, or equity holders of the
          applying organization or team DAO voters?
        </p>
      )}

      <div className="pt-2">
        <Heading as="h2" size="2xl">
          Impact statements
        </Heading>

        <ProjectContributions
          isLoading={metadata.isPending}
          project={metadata.data}
        />

        <ProjectImpact isLoading={metadata.isPending} project={metadata.data} />
        {fundingSources?.length > 0 && (
          <div className="mt-6 md:mt-10">
            <Heading className="m-0" as="h3" size="lg">
              Past grants and funding
            </Heading>
            <div className="mt-3 space-y-4">
              {fundingSources?.map((source, i) => {
                const type =
                  {
                    POKT_DAO_Grant: "POKT DAO Grant",
                    External_funding: "External funding",
                    REVENUE: "Revenue",
                    OTHER: "Other",
                  }[source.type] ?? source.type;
                return (
                  <div
                    key={i}
                    className="flex items-center gap-10 text-sm font-normal"
                  >
                    <div className="flex-1 truncate">{source.description}</div>
                    <div className="flex items-center justify-between gap-6">
                      <div className=" tracking-widest text-onSurfaceVariant-dark dark:text-outline-dark">
                        {type}
                      </div>
                      <div className=" justify-end ">
                        {suffixNumber(source.amount)} {source.currency}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div className="mt-6 flex flex-col items-baseline justify-between md:mt-10 md:flex-row">
          {metadata?.data?.socialMedias.length > 0 && (
            <div className="w-full md:w-1/3">
              <div className=" mb-3 text-lg font-bold text-onSurface-dark">
                Social media links
              </div>
              <LinkBox
                links={metadata?.data?.socialMedias}
                renderItem={(link) => (
                  <div className="flex-1 truncate" title={link.type}>
                    {link.type} Link
                  </div>
                )}
              />
            </div>
          )}
          {attestation?.refUID &&
            attestation?.refUID !==
              "0x0000000000000000000000000000000000000000000000000000000000000000" && (
              <div className="mt-6 w-full md:mt-0 md:w-1/3">
                <div className=" mb-3 text-lg font-bold text-onSurface-dark">
                  Previous edits on this project
                </div>
                <LinkBox
                  shouldValidateWithHttps={false}
                  links={[{ url: `${attestation?.refUID}` }]}
                  renderItem={(link) => (
                    <div className="flex-1 truncate" title={link.url}>
                      {link.url}
                    </div>
                  )}
                />
              </div>
            )}
        </div>
      </div>
    </div>
  );
}
