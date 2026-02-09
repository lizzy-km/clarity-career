import { Logo } from '@/components/logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary">
        <div className="mb-8">
            <Logo />
        </div>
        {children}
    </div>
  );
}
