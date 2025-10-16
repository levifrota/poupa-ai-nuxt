import { logOut } from "~/service/authService.js";

export const handleLogout = async (router: unknown) => {
  try {
    await logOut();
    router.push("/login");
  } catch (error) {
    console.error("Erro ao sair:", error);
    alert("Erro ao sair");
  }
};