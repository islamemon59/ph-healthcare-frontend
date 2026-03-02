/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { getDoctors } from "@/src/app/(commonLayout)/consultation/doctor/_action";
import { useQuery } from "@tanstack/react-query";

const Doctors = () => {
  const { data } = useQuery({
    queryKey: ["doctors"],
    queryFn: () => getDoctors(),
  });

  console.log(data);
  return (
    <div>
      {data.data.map((doctor: any) => (
        <p key={doctor.id}>{doctor.name}</p>
      ))}
    </div>
  );
};

export default Doctors;
