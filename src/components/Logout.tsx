// "use client";
// import React, { useState } from "react";
// import { Button } from "./ui/button";
// import { signOut } from "@/lib/auth-client";
// import { redirect, useRouter } from "next/navigation";
// import { useToast } from "@/hooks/use-toast";
// import { Loader } from "lucide-react";

// const Logout = () => {
//   const { toast } = useToast();
//   const router = useRouter();
//   const [loggingOut, setLoggingOut] = useState(false);
//   const handleLogout = async () => {
//     try {
//       setLoggingOut(true);
//       await signOut();
//       router.replace("/signin");
//     } catch (e) {
//       console.log(e);
//       toast({
//         title: "Couldn't logout",
//         description: "There was an error logging you out, please try again",
//       });
//     } finally {
//       setLoggingOut(false);
//     }
//   };
//   return (
//     <div className="w-full">
//       <Button
//         className="w-full bg-indigo-600"
//         onClick={handleLogout}
//         disabled={loggingOut}
//       >
//         Logout
//         {loggingOut && <Loader className="animate-spin" />}
//       </Button>
//     </div>
//   );
// };

// export default Logout;

const Logout = () => {};
export default Logout;
