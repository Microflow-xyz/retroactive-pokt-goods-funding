import Link from "next/link";
import { Button } from "~/components/ui/Button";

export const NextProjectButton = ({
  nextProjectId,
  isAdmin = false,
}: {
  nextProjectId: string;
  isAdmin?: boolean;
}) => {
  if (!isAdmin) return null;
  return (
    <div className="ml-2">
      <Link href={`/projects/${nextProjectId}`}>
        <Button
          variant="primary"
          className="h-auto w-full px-6 py-[0.625rem] text-sm font-medium md:w-auto"
        >
          Next Project
        </Button>
      </Link>
    </div>
  );
};
