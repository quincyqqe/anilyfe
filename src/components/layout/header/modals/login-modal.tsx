// "use client";
// import { Modal, ModalContent, ModalHeader, ModalBody, Button, addToast } from "@heroui/react";
// import { FaGoogle, FaGithub } from "react-icons/fa";
// import { useAuth } from "@/shared/services/providers/auth-provider";

// type Provider = "google" | "github";

// interface LoginModalProps {
//   isOpen: boolean;
//   onClose: () => void;
// }

// const PROVIDERS: { id: Provider; label: string; icon: React.ReactNode; className: string }[] = [
//   {
//     id: "google",
//     label: "Google",
//     icon: <FaGoogle />,
//     className: "hover:bg-blue-500/70",
//   },
//   {
//     id: "github",
//     label: "GitHub",
//     icon: <FaGithub />,
//     className: "hover:bg-zinc-800/80",
//   },
// ];

// export function LoginModal({ isOpen, onClose }: LoginModalProps) {
//   const { signInWithGoogle, signInWithGithub } = useAuth();

//   const signInMap: Record<Provider, () => Promise<void>> = {
//     google: signInWithGoogle,
//     github: signInWithGithub,
//   };

//   const handleSignIn = async (provider: Provider) => {
//     try {
//       await signInMap[provider]();
//       addToast({ title: "Вход выполнен", description: `Вы вошли через ${provider}.`, color: "success" });
//       onClose();
//     } catch (error) {
//       const message = error instanceof Error ? error.message : "Неизвестная ошибка";
//       addToast({ title: "Ошибка входа", description: message, color: "danger" });
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onOpenChange={onClose} backdrop="opaque" placement="center">
//       <ModalContent className="w-80 rounded-2xl bg-background/80 border border-white/20 shadow-2xl flex flex-col">
//         <ModalHeader className="flex flex-col items-center text-white font-bold text-lg pb-4">
//           🔒 Вход в AniLyfe
//         </ModalHeader>
//         <ModalBody className="pb-6">
//           <div className="flex flex-col gap-3">
//             {PROVIDERS.map(({ id, label, icon, className }) => (
//               <Button
//                 key={id}
//                 color="default"
//                 variant="shadow"
//                 startContent={icon}
//                 onPress={() => handleSignIn(id)}
//                 className={`w-full gap-2 rounded-lg bg-white/10 active:scale-95 transition-all text-white font-semibold shadow-md ${className}`}
//               >
//                 {label}
//               </Button>
//             ))}
//           </div>
//           <p className="pt-3 text-xs text-center text-neutral-300">
//             Авторизация защищена OAuth. Ваши данные не сохраняются на сервере AniLyfe.
//           </p>
//         </ModalBody>
//       </ModalContent>
//     </Modal>
//   );
// }
