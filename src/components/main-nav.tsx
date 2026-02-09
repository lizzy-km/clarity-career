import Link from 'next/link';
import { cn } from '@/lib/utils';
import { Logo } from './logo';
import { UserNav } from './user-nav';
import { Button } from './ui/button';

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const navLinks = [
    { href: '/jobs', label: 'Jobs' },
    { href: '/companies', label: 'Companies' },
    { href: '/reviews', label: 'Company Reviews' },
    { href: '/salaries', label: 'Salaries' },
    { href: '/interviews', label: 'Interviews' },
  ];

  return (
    <header className={cn(" px-4 sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60", className)} {...props}>
      <div className="container flex h-16 items-center">
        <Logo />
        <nav className="hidden md:flex items-center space-x-4 lg:space-x-6 mx-6">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
        <div className=" px-4 flex flex-1 items-center justify-end space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  );
}
