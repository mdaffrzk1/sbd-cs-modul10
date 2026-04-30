import { redirect } from "next/navigation";

export default function Home() {
  // Arahkan ke halaman login secara otomatis saat membuka http://localhost:3001
  redirect("/login");
}
