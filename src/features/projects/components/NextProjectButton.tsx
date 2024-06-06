import Link from "next/link";
import { Button } from "~/components/ui/Button";
import { useFilter } from "~/features/filter/hooks/useFilter";

export const NextProjectButton = ({
  nextProjectId,
  isAdmin = false,
}: {
  nextProjectId: string;
  isAdmin?: boolean;
}) => {
  const { orderBy, sortOrder, search } = useFilter();

  if (!isAdmin) return null;
  return (
    <div className="ml-2">
      <Link href={`/projects/${nextProjectId}?search=${search}&orderBy=${orderBy}&sortOrder=${sortOrder}`}>
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
