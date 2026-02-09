import { MainNav } from "@/components/main-nav";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <MainNav />
      <main className="flex-grow container py-8 px-4">
        {children}
      </main>
    </div>
  );
}
