import { useAccount } from "wagmi";
import { Alert } from "~/components/ui/Alert";
import { Heading } from "~/components/ui/Heading";
import { config } from "~/config";
import ApproveVoters from "~/features/voters/components/ApproveVoters";
import { VotersList } from "~/features/voters/components/VotersList";
import { Layout } from "~/layouts/DefaultLayout";

export default function VotersPage() {
  const { address } = useAccount();

  return (
    <Layout title="Manage voters">
      {address ? (
        <>
          <div className="flex items-center justify-between">
            <Heading as="h1" size="3xl">
              Approved voters
            </Heading>
            <ApproveVoters />
          </div>
          <Alert variant="info" className={"mb-2"}>
            Added voters can take 10 minutes to show up.
          </Alert>
          {config.skipApprovedVoterCheck ? (
            <Alert variant="warning" className="mb-4 ">
              Configuration has disabled voter approval check. Anyone is an
              eligible voter.
            </Alert>
          ) : null}
          <VotersList />
        </>
      ) : (
        <Alert variant="info" title="Connect your wallet to continue"></Alert>
      )}
    </Layout>
  );
}
