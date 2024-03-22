import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import FormNewCommunity from "@/components/community/form-new-community";
import useCurrentUser from "@/hooks/useCurrentUser";
import LoginModal from "@/components/auth/login-modal";
import { login } from "@/lib/actions";

export default function ButtonCreateCommunity() {
  const user = useCurrentUser();
  const [openModal, setOpenModal] = useState(false);
  const [loginModal, setLoginModal] = useState(false);

  function handleOpen() {
    if (user?.id) {
      setOpenModal(true);
    } else {
      setLoginModal(true);
    }
  }

  return (
    <>
      {loginModal && (
        <LoginModal
          open={loginModal}
          onClose={() => setLoginModal(false)}
          REDIRECT="/"
        />
      )}
      <div className=" w-full">
        <FormNewCommunity
          open={openModal}
          closeModal={() => setOpenModal(false)}
        />

        <Button
          onClick={handleOpen}
          variant={"outline"}
          className="border-2 w-full rounded-full"
        >
          New Community
        </Button>
      </div>
    </>
  );
}
