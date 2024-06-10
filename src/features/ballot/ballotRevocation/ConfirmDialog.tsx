import React from "react";
import { Button } from "~/components/ui/Button";
import { Dialog } from "~/components/ui/Dialog";

export const ConfirmDialog = ({
  onSubmit,
  onOpenChange,
  isOpen,
  isLoading,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  isLoading: boolean;
}) => {
  return (
    <Dialog
      size="sm"
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={<p className=" text-base font-semibold">Are you sure?</p>}
    >
      <div className="flex flex-col items-center gap-3 pb-12 pl-[0.875rem] pt-6">
        <span className=" flex h-10 w-10 items-center justify-center rounded-3xl bg-[#FFB3B2] bg-opacity-40 text-errorContainer">
          i
        </span>
        <p className="text-base font-semibold">
          Are you sure you want to revoke this ballot?
        </p>
        <p className="text-sm font-normal">
          Your previous ballot will be lost and it can not be restored
        </p>
      </div>
      <div className="flex items-center justify-end gap-2">
        <Button
          variant="outline"
          className="h-10 w-fit px-6 text-sm font-semibold"
          onClick={() => onOpenChange(false)}
        >
          cancel
        </Button>
        <Button
          variant="primary"
          className="h-10 w-fit px-6 text-sm font-medium"
          onClick={() => onSubmit()}
          isLoading={isLoading}
        >
          Revoke Ballot
        </Button>
      </div>
    </Dialog>
  );
};
