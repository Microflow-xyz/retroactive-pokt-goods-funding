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

//FIXME: This is modal should be removed
function BallotAllocation({
  droppedItems,
  setDroppedItems,
  isModal,
}: {
  droppedItems: ballotImpacts;
  setDroppedItems: React.Dispatch<React.SetStateAction<ballotImpacts>>;
  isModal: boolean;
}) {
  // const projects = useSearchProjects();
  const projects = [
    { id: 1, name: "project1" },
    { id: 2, name: "project2" },
    { id: 3, name: "project3" },
    { id: 4, name: "project4" },
    { id: 5, name: "project5" },
    { id: 6, name: "project6" },
    { id: 7, name: "project7" },
    { id: 8, name: "project8" },
    { id: 9, name: "project9" },
    { id: 10, name: "project10" },
    { id: 11, name: "project11" },
    { id: 12, name: "project12" },
    { id: 13, name: "project13" },
    { id: 14, name: "project14" },
    { id: 15, name: "project15" },
    { id: 16, name: "project16" },
  ];
  const allProjects = projects.filter((project) => {
    const droppedProject = Object.values(droppedItems)
      .flat()
      .includes(project.name);
    return !droppedProject;
  });

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
    <div
      className={`${!isModal && "mt-16 flex"} items-baseline justify-between gap-5`}
    >
      <div
        className={`flex ${isModal ? "w-full" : "w-1/2"} flex-col justify-between gap-3`}
      >
        <h4 className="text-base font-semibold">
          Application Pool ({allProjects?.length})
        </h4>
        <div className="flex flex-col items-center gap-6 rounded-xl border border-outline-dark bg-onBackground-dark p-5">
          <Input placeholder="Search among projects" />
          <div className="flex flex-wrap gap-2">
            {allProjects?.map((project, index) => (
              <ProjectItem key={project.id} project={project} />
            ))}
          </div>
        </div>
      </div>
      <div
        className={`flex ${isModal ? "mt-3 w-full" : "w-1/2"} flex-col justify-between gap-3`}
      >
        <h4 className="text-base font-semibold">Impact Tiers</h4>
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
            <DropTargetAccordion
              shelveName="highestImpactProjects"
              label={`Highest Impact`}
              setDroppedItems={setDroppedItems}
              droppedItems={droppedItems}
            />

            <DropTargetAccordion
              shelveName="highImpactProjects"
              label={`High Impact`}
              setDroppedItems={setDroppedItems}
              droppedItems={droppedItems}
            />

            <DropTargetAccordion
              shelveName="mediumImpactProjects"
              label={`Medium Impact`}
              setDroppedItems={setDroppedItems}
              droppedItems={droppedItems}
            />

            <DropTargetAccordion
              shelveName="lowImpactProjects"
              label={`Low Impact`}
              setDroppedItems={setDroppedItems}
              droppedItems={droppedItems}
            />
          </Form>
        </div>
      </div>
    </div>
  );
}

export default BallotAllocation;
