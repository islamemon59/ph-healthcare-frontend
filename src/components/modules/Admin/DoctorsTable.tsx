"use client";
import { getDoctors } from "@/src/services/doctor.services";
import { useQuery } from "@tanstack/react-query";
import DataTable from "../../shared/table/DataTable";
import { IDoctor } from "@/src/types/doctor.types";
import { doctorColumns } from "./doctors.Column";

const DoctorsTable = () => {

  const { data: doctorDataResponse, isLoading } = useQuery({
    queryKey: ["doctors"],
    queryFn: getDoctors,
  });

  const doctors = doctorDataResponse?.data;
  console.log(doctors);

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
      data={doctors as IDoctor[]}
      columns={doctorColumns}
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
