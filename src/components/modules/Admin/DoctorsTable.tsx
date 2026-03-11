/* eslint-disable react-hooks/incompatible-library */
"use client";
import { getDoctors } from "@/src/services/doctor.services";
import { useQuery } from "@tanstack/react-query";
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const DoctorsTable = () => {
  const doctorsColumns = [
    { accessorKey: "name", header: "Name" },
    { accessorKey: "experience", header: "Experience" },
  ];
  const { data: doctorDataResponse } = useQuery({
    queryKey: ["doctors"],
    queryFn: getDoctors,
  });

  const { data: doctors } = doctorDataResponse! || [];

  const { getHeaderGroups, getRowModel } = useReactTable({
    data: doctors,
    columns: doctorsColumns,
    getCoreRowModel: getCoreRowModel(),
  });
  return (
    <Table>
      <TableHeader>
        {getHeaderGroups().map((hg) => (
          <TableRow key={hg.id}>
            {hg.headers.map((header) => (
              <TableHead key={header.id}>
                {flexRender(
                  header.column.columnDef.header,
                  header.getContext(),
                )}
              </TableHead>
            ))}
          </TableRow>
        ))}
      </TableHeader>
      <TableBody>
                {getRowModel().rows.map((row) => (
          <TableRow key={row.id}>
            {row.getVisibleCells().map((cell) => (
              <TableCell key={cell.id}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default DoctorsTable;
