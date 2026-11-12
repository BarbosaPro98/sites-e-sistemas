import { redirect } from "next/navigation";

/** O QR Code pode apontar para /cadastro ou para a raiz: ambos abrem o formulário. */
export default function CadastroPage() {
  redirect("/");
}
