import { Header } from '@/components/header';
import { Nav } from '@/components/nav';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';

export default function ConsumerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full">
        <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 z-80 bg-sidebar">
          <Nav />
        </div>
        <div className="flex flex-col flex-1 md:pl-64">
          <Header />
          <Separator />
          <main className="flex-1">{children}</main>
        </div>
      </div>
    </SidebarProvider>
  );
}