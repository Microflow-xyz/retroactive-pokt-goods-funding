import React, { useEffect } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useSession } from "next-auth/react";
import { useSearchProjects } from "~/features/projects/hooks/useProjects";
import { type Attestation } from "~/utils/fetchAttestations";
import { BallotImpactsSchema, type ballotImpacts } from "../types";
import { Input, Form, FormControl } from "~/components/ui/Form";
import ProjectItem from "./ProjectItem";
import DropTargetAccordion from "./DropTargetAccordion";
import { useSubmitBallot } from "./hooks/useSubmitBallot";
import { useIsCorrectNetwork } from "~/hooks/useIsCorrectNetwork";

function BallotAllocation({
  droppedItems,
  setDroppedItems,
}: {
  droppedItems: ballotImpacts;
  setDroppedItems: React.Dispatch<React.SetStateAction<ballotImpacts>>;
}) {
  const projects = useSearchProjects();
  const allProjects: Attestation[] = projects?.data?.pages
    ? [].concat(...projects?.data?.pages).filter((project) => {
        const droppedProject = Object.values(droppedItems)
          .flat()
          .includes(project?.name);
        return !droppedProject;
      })
    : [];
  const { isCorrectNetwork, correctNetwork } = useIsCorrectNetwork();
  const { data: session } = useSession();

  const SubmitBallotSchema = z.object({
    voterId: z.string(),
    impacts: BallotImpactsSchema,
  });

  const submit = useSubmitBallot({
    onSuccess: () => {
      toast.success("Ballot submitted successfully!");
    },
    onError: (err: { reason?: string; data?: { message: string } }) => {
      toast.error("An error occurred submitting your ballot. ", {
        description:
          err.reason ??
          err.data?.message ??
          (!isCorrectNetwork &&
            `You must be connected to ${correctNetwork.name}`) ??
          (!session && (
            <div>You must connect wallet to create an application</div>
          )),
      });
    },
  });
  return (
    <div className="mt-16 flex items-baseline justify-between gap-5">
      <div className="flex w-1/2 flex-col justify-between gap-3">
        <h4 className="text-base font-semibold">
          Application Pool ({allProjects?.length})
        </h4>
        <div className="flex flex-col items-center gap-6 rounded-xl border border-outline-dark bg-onBackground-dark p-5">
          <Input placeholder="Search among projects" />
          <div className="flex flex-wrap gap-2">
            {allProjects?.map((project) => (
              <ProjectItem key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
      <div className="flex w-1/2 flex-col justify-between gap-3">
        <h4 className="text-base font-semibold">Ballot(0)</h4>
        <div className="rounded-xl border border-outline-dark bg-onBackground-dark">
          <Form
            schema={SubmitBallotSchema}
            onSubmit={async ({ voterId, impacts }) => {
              submit.mutate({
                voterId,
                impacts,
              });
            }}
          >
            <FormControl name="impacts.highestImpactProjects" required>
              <DropTargetAccordion
                shelveName="highestImpactProjects"
                label={`Highest Extra Impact`}
                setDroppedItems={setDroppedItems}
                droppedItems={droppedItems}
              />
            </FormControl>
            <FormControl name="impacts.highImpactProjects" required>
              <DropTargetAccordion
                shelveName="highImpactProjects"
                label={`High Extra Impact`}
                setDroppedItems={setDroppedItems}
                droppedItems={droppedItems}
              />
            </FormControl>
            <FormControl name="impacts.mediumImpactProjects" required>
              <DropTargetAccordion
                shelveName="mediumImpactProjects"
                label={`Medium Extra Impact`}
                setDroppedItems={setDroppedItems}
                droppedItems={droppedItems}
              />
            </FormControl>
            <FormControl name="impacts.lowImpactProjects" required>
              <DropTargetAccordion
                shelveName="lowImpactProjects"
                label={`Low Extra Impact`}
                setDroppedItems={setDroppedItems}
                droppedItems={droppedItems}
              />
            </FormControl>
          </Form>
        </div>
      </div>
    </div>
  );
}

export default BallotAllocation;
