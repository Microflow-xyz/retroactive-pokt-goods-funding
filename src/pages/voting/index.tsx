import { useAccount } from "wagmi";
import { useIsAdmin } from "~/hooks/useIsAdmin";
import { VotingWrapper } from "~/features/voting/components/VotingWrapper";
import { Layout } from "~/layouts/DefaultLayout";
import { useIsVoter } from "~/hooks/useIsVoter";
import { Alert } from "~/components/ui/Alert";

export default function Voting() {
  const { address } = useAccount();
  const isAdmin = useIsAdmin();
  const isVoter = useIsVoter();

  return (
    <Layout extraFullWidth>
      {/*
      Uncomment this part to make the voting page  non-public
      
      {!address ? (
        <Alert variant="info" title="Connect your wallet to continue"></Alert>
      ) : 
      !isAdmin && !isVoter ? (
        <Alert variant="info" title="You do not have access to this page"></Alert>
      ) : 
      (
        <VotingWrapper />
      )} */}
      <VotingWrapper />
    </Layout>
  );
}
