import { ProjectAvatar } from "./ProjectAvatar";
import { ProjectBanner } from "./ProjectBanner";
import { Heading } from "~/components/ui/Heading";
import { Skeleton } from "~/components/ui/Skeleton";
import { useProjectMetadata } from "../hooks/useProjects";
import { type Attestation } from "~/utils/fetchAttestations";
import { ImpactCategories } from "./ImpactCategories";
import { formatNumber } from "~/utils/formatNumber";
import { config } from "~/config";

export function ProjectItem({
  attestation,
  isLoading,
}: {
  attestation: Attestation;
  isLoading: boolean;
}) {
  const metadata = useProjectMetadata(attestation?.metadataPtr);

  return (
    <article
      data-testid={`project-${attestation.id}`}
      className="hover:border-primary-500 group border border-gray-200 px-5 py-6 dark:border-onPrimary-light dark:hover:border-outline-dark"
    >
      <div className="opacity-70 transition-opacity group-hover:opacity-100">
        <ProjectBanner profileId={attestation?.recipient} />
        <ProjectAvatar
          rounded="full"
          className="-mt-8 ml-4"
          profileId={attestation?.recipient}
        />
      </div>
      <Heading
        className="mb-2 mt-5 truncate text-onSurface-dark"
        size="lg"
        as="h3"
      >
        <Skeleton isLoading={isLoading}>{attestation?.name}</Skeleton>
      </Heading>
      <div className="mb-5">
        <p className="line-clamp-2 h-10 text-sm dark:text-onSurface-dark">
          <Skeleton isLoading={isLoading} className="w-full">
            {metadata.data?.bio}
          </Skeleton>
        </p>
      </div>
      <Skeleton isLoading={isLoading} className="w-[100px]">
        <ImpactCategories tags={metadata.data?.impactCategory} />
      </Skeleton>
    </article>
  );
}
