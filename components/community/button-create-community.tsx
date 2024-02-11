import React, { useState } from "react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import FormNewCommunity from "@/components/community/form-new-community";

export default function ButtonCreateCommunity() {
  const [openModal, setOpenModal] = useState(false);

  return (
    <div>
      <FormNewCommunity
        open={openModal}
        closeModal={() => setOpenModal(false)}
      />

      <Button onClick={() => setOpenModal(true)}>New Community</Button>
    </div>
  );
}
