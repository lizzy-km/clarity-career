import Image from 'next/image';
import Link from 'next/link';
import { Briefcase, Building2, DollarSign, MessageSquare, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Logo } from '@/components/logo';
import { UserNav } from '@/components/user-nav';

export default function HomePage() {
  const features = [
    {
      icon: <Briefcase className="h-8 w-8 text-primary" />,
      title: 'Job Listings',
      description: 'Find your next career move with our comprehensive, filterable job board.',
      link: '/jobs',
    },
    {
      icon: <Building2 className="h-8 w-8 text-primary" />,
      title: 'Company Reviews',
      description: 'Get the inside scoop on company culture, salaries, and interview processes.',
      link: '/reviews',
    },
    {
      icon: <DollarSign className="h-8 w-8 text-primary" />,
      title: 'Salary Data',
      description: 'Benchmark your salary against real data from thousands of professionals.',
      link: '/salaries',
    },
    {
      icon: <MessageSquare className="h-8 w-8 text-primary" />,
      title: 'Interview Prep',
      description: 'Read about real interview experiences and questions to help you prepare.',
      link: '/interviews',
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <header className="fixed top-0 left-0 right-0 z-50 transition-all bg-transparent">
        <div className="container mx-auto flex h-20 items-center justify-between">
          <Logo className="text-white drop-shadow-md" />
          <UserNav />
        </div>
      </header>

      <main className="flex-grow">
        <section className="relative h-[60vh] md:h-[70vh] flex items-center justify-center text-center text-white">
          <Image
            src="https://picsum.photos/seed/hero-bg/1920/1080"
            alt="Modern office background"
            fill
            className="object-cover -z-10"
            priority
            data-ai-hint="modern office"
          />
          <div className="absolute inset-0 bg-primary/70 -z-10" />
          <div className="container px-4">
            <h1 className="text-4xl md:text-6xl font-bold font-headline drop-shadow-lg animate-fade-in-down">
              Find Your Career Clarity
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg md:text-xl text-primary-foreground/90 drop-shadow-md animate-fade-in-up">
              Access transparent job listings, company reviews, salary data, and interview insights.
            </p>
            <div className="mt-8 max-w-xl mx-auto flex gap-2 animate-fade-in-up-delay">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Job title, company, or keyword"
                  className="pl-10 h-12 text-base text-foreground"
                />
              </div>
              <Button size="lg" className="h-12 bg-accent hover:bg-accent/90">
                Search
              </Button>
            </div>
          </div>
        </section>

        <section id="features" className="py-16 md:py-24 bg-background">
          <div className="container">
            <div className="text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold font-headline">Why ClarityCareer?</h2>
              <p className="mt-4 text-muted-foreground text-lg">
                We provide the tools and information you need to make informed career decisions.
              </p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center shadow-md hover:shadow-xl transition-shadow duration-300">
                  <CardHeader>
                    <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit">
                      {feature.icon}
                    </div>
                    <CardTitle className="mt-4 font-headline">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{feature.description}</p>
                    <Button variant="link" asChild className="mt-4">
                      <Link href={feature.link}>Learn More &rarr;</Link>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-secondary">
          <div className="container text-center">
             <h2 className="text-3xl md:text-4xl font-bold font-headline">Ready to Take Control?</h2>
             <p className="mt-4 text-muted-foreground text-lg max-w-xl mx-auto">Join thousands of professionals who use ClarityCareer to navigate their career path with confidence.</p>
             <Button size="lg" asChild className="mt-8">
              <Link href="/signup">Get Started for Free</Link>
             </Button>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-primary-foreground">
        <div className="container py-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm">&copy; {new Date().getFullYear()} ClarityCareer. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <Link href="#" className="text-sm hover:underline">Privacy Policy</Link>
            <Link href="#" className="text-sm hover:underline">Terms of Service</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
