import { placeholderSalaries } from '@/lib/placeholder-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export default function SalariesPage() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <h1 className="text-4xl font-bold font-headline mb-2">Salary Insights</h1>
        <p className="text-lg text-muted-foreground mb-8">Know your worth. Explore salary data by job title and location.</p>
        
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Job Title</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Years of Exp.</TableHead>
                <TableHead className="text-right">Salary</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {placeholderSalaries.map(salary => (
                <TableRow key={salary.id}>
                  <TableCell className="font-medium">{salary.jobTitle}</TableCell>
                  <TableCell>{salary.location}</TableCell>
                  <TableCell>{salary.yearsOfExperience}</TableCell>
                  <TableCell className="text-right">{formatCurrency(salary.salary)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Contribute Your Salary</CardTitle>
            <CardDescription>Anonymously share your salary to help the community.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="job-title">Job Title</Label>
              <Input id="job-title" placeholder="e.g., Software Engineer" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" placeholder="e.g., New York, NY" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="salary">Annual Salary (USD)</Label>
              <Input id="salary" type="number" placeholder="e.g., 120000" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="experience">Years of Experience</Label>
              <Input id="experience" type="number" placeholder="e.g., 5" />
            </div>
            <Button className="w-full">Submit Anonymously</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
