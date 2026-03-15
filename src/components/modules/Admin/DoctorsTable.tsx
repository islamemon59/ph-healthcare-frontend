"use client";
import { getDoctors } from "@/src/services/doctor.services";
import { useQuery } from "@tanstack/react-query";
import DataTable from "../../shared/table/DataTable";
import { IDoctor } from "@/src/types/doctor.types";

const DoctorsTable = () => {
  const doctorsColumns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "experience", header: "Experience" },
  ];
  const { data: doctorDataResponse, isLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: getDoctors,
  });

  const { data: doctors } = doctorDataResponse! || [];

  const handleView = (doctor: IDoctor) => {
    console.log("View doctor", doctor);
  };

  const handleEdit = (doctor: IDoctor) => {
    console.log("Edit doctor", doctor);
  };

  const handleDelete = (doctor: IDoctor) => {
    console.log("Delete doctor", doctor);
  };
  return (
    <DataTable
      data={doctors}
      columns={doctorsColumns}
      isLoading={isLoading}
      emptyMessage="No doctors found."
      actions={{
        onView: handleView,
        onEdit: handleEdit,
        onDelete: handleDelete,
      }}
    />
  );
};

export default DoctorsTable;
