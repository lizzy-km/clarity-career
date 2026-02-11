"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Briefcase, Building2, DollarSign, MessageSquare, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/logo';
import { UserNav } from '@/components/user-nav';
import { cn } from '@/lib/utils';

// Header that becomes opaque on scroll
function HomeHeader() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={cn(
      "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
      scrolled ? "bg-background/80 backdrop-blur-sm border-b" : "bg-transparent"
    )}>
      <div className="container mx-auto flex h-20 items-center justify-between">
        <Logo className={cn(scrolled ? "text-primary" : "text-white drop-shadow-md")} />
        <div className="flex items-center gap-4">
            <nav className="hidden md:flex items-center gap-6">
                <Link href="/jobs" className={cn("text-sm font-medium transition-colors", scrolled ? "text-muted-foreground hover:text-primary" : "text-primary-foreground/80 hover:text-white")}>Jobs</Link>
                <Link href="/companies" className={cn("text-sm font-medium transition-colors", scrolled ? "text-muted-foreground hover:text-primary" : "text-primary-foreground/80 hover:text-white")}>Companies</Link>
                <Link href="/reviews" className={cn("text-sm font-medium transition-colors", scrolled ? "text-muted-foreground hover:text-primary" : "text-primary-foreground/80 hover:text-white")}>Reviews</Link>
            </nav>
            <div className="hidden md:block">
              <UserNav />
            </div>
        </div>
      </div>
    </header>
  );
}


export default function HomePage() {
  const features = [
    {
      icon: <Briefcase className="h-6 w-6 text-primary" />,
      title: 'Search Millions of Jobs',
      description: 'Find your next career move with our comprehensive, filterable job board.',
    },
    {
      icon: <Building2 className="h-6 w-6 text-primary" />,
      title: 'Get Company Insights',
      description: 'Get the inside scoop on company culture, salaries, and interview processes.',
    },
    {
      icon: <DollarSign className="h-6 w-6 text-primary" />,
      title: 'Know Your Worth',
      description: 'Benchmark your salary against real data from thousands of professionals.',
    },
    {
      icon: <MessageSquare className="h-6 w-6 text-primary" />,
      title: 'Ace Your Interview',
      description: 'Read about real interview experiences to help you prepare.',
    },
  ];
  
  const [searchTerm, setSearchTerm] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/jobs?q=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.push('/jobs');
    }
  };


  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <HomeHeader />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-primary text-center text-primary-foreground">
          <div className="container px-4 pt-32 pb-20 md:pt-40 md:pb-24 animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold font-headline tracking-tight">
              Your Career, Clarified.
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/80">
              The transparent job board. Find jobs, company reviews, and salary insights all in one place.
            </p>
            <form onSubmit={handleSearch} className="mt-8 w-full max-w-2xl mx-auto flex gap-2">
              <div className="relative flex-grow">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Job title, company, or keyword"
                  className="pl-12 h-14 text-base bg-background/90 text-foreground focus:bg-background rounded-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Button type="submit" size="lg" className="h-14 bg-accent hover:bg-accent/90 text-accent-foreground px-8 rounded-full">
                Search
              </Button>
            </form>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-16 md:py-24 bg-background">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Everything you need for your job search</h2>
              <p className="mt-4 text-muted-foreground text-lg">
                We're not just a job board. We provide the tools and information you need to make informed career decisions.
              </p>
            </div>
            <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <div key={feature.title} className="text-center p-6 border border-transparent hover:border-border hover:bg-secondary transition-colors rounded-lg">
                  <div className="mx-auto bg-primary/10 text-primary p-3 rounded-full w-fit mb-4">
                    {feature.icon}
                  </div>
                  <h3 className="text-lg font-semibold font-headline">{feature.title}</h3>
                  <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="py-16 md:py-24 bg-secondary">
          <div className="container">
            <div className="text-center max-w-3xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Get Started in 3 Easy Steps</h2>
            </div>
            <div className="mt-12 grid md:grid-cols-3 gap-8 md:gap-16 text-center relative">
                <div className="absolute top-6 left-0 right-0 h-0.5 bg-border hidden md:block" />
                 <div className="relative flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl z-10 border-4 border-secondary">1</div>
                    <h3 className="mt-4 text-lg font-semibold">Search and Discover</h3>
                    <p className="mt-1 text-muted-foreground text-sm">Filter through millions of jobs and companies.</p>
                </div>
                <div className="relative flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl z-10 border-4 border-secondary">2</div>
                    <h3 className="mt-4 text-lg font-semibold">Research and Compare</h3>
                    <p className="mt-1 text-muted-foreground text-sm">Read anonymous reviews and compare salaries.</p>
                </div>
                <div className="relative flex flex-col items-center">
                    <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-xl z-10 border-4 border-secondary">3</div>
                    <h3 className="mt-4 text-lg font-semibold">Apply with Confidence</h3>
                    <p className="mt-1 text-muted-foreground text-sm">Submit your application directly and track its status.</p>
                </div>
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-20 md:py-32 bg-background">
          <div className="container text-center">
             <h2 className="text-3xl md:text-5xl font-bold font-headline max-w-2xl mx-auto">Ready to find a job you love?</h2>
             <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">Create a free account to get personalized job recommendations, save your favorite listings, and get salary insights.</p>
             <Button size="lg" asChild className="mt-8 text-base h-12 px-8">
              <Link href="/signup">Get Started for Free <ArrowRight className="ml-2 h-4 w-4" /></Link>
             </Button>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-primary-foreground">
        <div className="container py-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p className="text-primary-foreground/80">&copy; {new Date().getFullYear()} ClarityCareer. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="text-primary-foreground/80 hover:text-white">Privacy Policy</Link>
            <Link href="#" className="text-primary-foreground/80 hover:text-white">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
