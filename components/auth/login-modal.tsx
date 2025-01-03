import { MdClose } from "react-icons/md";
import LoginForm from "./login-form";

export default function LoginModal({
  open = false,
  onClose,
  REDIRECT,
}: {
  open: boolean;
  onClose: () => void;
  REDIRECT: string;
}) {
  if (!open) return undefined;
  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className=" cursor-default fixed flex items-center justify-center w-full h-full top-0 left-0 z-50 bg-stone-900/50"
    >
      <div className="w-fit relative">
        <button className="absolute top-2 right-2 group" onClick={onClose}>
          <MdClose size={20} className="group-hover:hover:fill-red-500" />
        </button>
        <LoginForm REDIRECT={REDIRECT} />
      </div>
    </div>
  );
}
