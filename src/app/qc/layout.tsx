
'use client';
import { Header } from '@/components/header';
import { Nav } from '@/components/nav';
import {
  Sidebar,
  SidebarContent,
  SidebarInset,
  SidebarProvider,
} from '@/components/ui/sidebar';
import { SampleProvider } from '@/context/sample-context';
import { NotificationProvider } from '@/context/notification-context';

export default function QCLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SampleProvider>
        <NotificationProvider>
            <SidebarProvider>
                <Sidebar side="left" collapsible="icon">
                <SidebarContent>
                    <Nav />
                </SidebarContent>
                </Sidebar>
                <SidebarInset>
                <Header />
                <main className="p-4 sm:p-6 lg:p-8 bg-background">{children}</main>
                </SidebarInset>
            </SidebarProvider>
        </NotificationProvider>
    </SampleProvider>
  );
}
