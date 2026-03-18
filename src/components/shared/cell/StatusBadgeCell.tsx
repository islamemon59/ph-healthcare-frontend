import { Badge } from "@/src/components/ui/badge";
import { UserStatus } from "@/src/types/doctor.types";
import React from "react";

interface StatusBadgeCellProps {
  status: UserStatus;
}

const StatusBadgeCell = ({ status }: StatusBadgeCellProps) => {
  return (
    <Badge
      variant={
        status === UserStatus.ACTIVE
          ? "default"
          : status === UserStatus.BLOCKED
            ? "destructive"
            : "secondary"
      }
    >
      <span className="text-sm capitalize">{status.toLowerCase()}</span>
    </Badge>
  );
};

export default StatusBadgeCell;
