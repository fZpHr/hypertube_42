'use client';
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from '@/contexts/AuthContext';
import { Navbar } from "@/app/components/ui/navbar";
import { usePathname } from "next/navigation"
import useAuthCheck from "@/hooks/useAuthCheck";


const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});



export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <AuthCheckWrapper />
          {pathname !== "/" && pathname !== "/auth/login" && pathname !== "/auth/register" && ( 
              <Navbar />
          )}
        {children}
        </AuthProvider>
      </body>
    </html >
  );
}

const AuthCheckWrapper = () => {
  useAuthCheck();
  return null;
};
