import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Sidebar />
      <div className="md:pl-[260px]">
        <Header />
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </>
  );
}
