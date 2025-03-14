import React, { useState } from "react";
import Head from "next/head";
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Link from "next/link";
import type { GetServerSidePropsContext } from 'next';

interface CiterData {
  id: string;
  name: string;
  university: string;
  totalCitations: number;
}

// Sample data for the citers table
const sampleCiters: CiterData[] = [
  { id: "1", name: "Dr. Sarah Johnson", university: "Stanford University", totalCitations: 342 },
  { id: "2", name: "Prof. Michael Chen", university: "MIT", totalCitations: 287 },
  { id: "3", name: "Dr. Emily Rodriguez", university: "University of California, Berkeley", totalCitations: 215 },
  { id: "4", name: "Prof. David Kim", university: "Harvard University", totalCitations: 198 },
  { id: "5", name: "Dr. Lisa Wang", university: "University of Oxford", totalCitations: 176 },
  { id: "6", name: "Prof. James Wilson", university: "ETH Zurich", totalCitations: 163 },
  { id: "7", name: "Dr. Sophia Patel", university: "University of Cambridge", totalCitations: 154 },
  { id: "8", name: "Prof. Robert Garcia", university: "University of Tokyo", totalCitations: 142 },
  { id: "9", name: "Dr. Olivia Martinez", university: "National University of Singapore", totalCitations: 137 },
  { id: "10", name: "Prof. Thomas Lee", university: "University of Toronto", totalCitations: 129 },
  { id: "11", name: "Dr. Emma Brown", university: "Imperial College London", totalCitations: 118 },
  { id: "12", name: "Prof. Daniel Smith", university: "Tsinghua University", totalCitations: 112 },
  { id: "13", name: "Dr. Ava Williams", university: "University of Michigan", totalCitations: 105 },
  { id: "14", name: "Prof. Alexander Davis", university: "Technical University of Munich", totalCitations: 98 },
  { id: "15", name: "Dr. Natalie Taylor", university: "University of Edinburgh", totalCitations: 92 },
];

// Add a User interface for type safety
interface User {
  id: string;
  name: string;
  // Add other user properties as needed
}

// Add props type for the component
interface DashboardProps {
  user: User;
}

export default function Citers({ user }: DashboardProps) {
  const [searchText, setSearchText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof CiterData;
    direction: 'ascending' | 'descending';
  } | null>({ key: 'totalCitations', direction: 'descending' });

  // Filter data based on search text
  const filteredData = sampleCiters.filter(
    item =>
      item.name.toLowerCase().includes(searchText.toLowerCase()) ||
      item.university.toLowerCase().includes(searchText.toLowerCase())
  );

  // Apply sorting to data
  const sortedData = React.useMemo(() => {
    const sortableData = [...filteredData];
    if (sortConfig !== null) {
      sortableData.sort((a, b) => {
        if (typeof a[sortConfig.key] === 'string') {
          return sortConfig.direction === 'ascending'
            ? (a[sortConfig.key] as string).localeCompare(b[sortConfig.key] as string)
            : (b[sortConfig.key] as string).localeCompare(a[sortConfig.key] as string);
        }
        return sortConfig.direction === 'ascending'
          ? (a[sortConfig.key] as number) - (b[sortConfig.key] as number)
          : (b[sortConfig.key] as number) - (a[sortConfig.key] as number);
      });
    }
    return sortableData;
  }, [filteredData, sortConfig]);

  // Sort data by a given key
  const requestSort = (key: keyof CiterData) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Calculate pagination values
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = sortedData.slice(startIndex, startIndex + pageSize);
  
  // Handle pagination
  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };
  
  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <>
      <Head>
        <title>Citers | MeritPath</title>
      </Head>
      
      <div className="container mx-auto py-10 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold tracking-tight">Shortlist Potential Citers</h1>
          <div className="text-sm text-muted-foreground">
            Logged in as: {user.name}
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Potential Recommenders</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
              <div className="relative flex-1 w-full sm:max-w-sm">
                <MagnifyingGlassIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search by name or university..."
                  className="pl-8"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
            </div>
            
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead 
                      className="cursor-pointer" 
                      onClick={() => requestSort('name')}
                    >
                      Name {sortConfig?.key === 'name' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer" 
                      onClick={() => requestSort('university')}
                    >
                      University {sortConfig?.key === 'university' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead 
                      className="cursor-pointer text-right" 
                      onClick={() => requestSort('totalCitations')}
                    >
                      Total Citations {sortConfig?.key === 'totalCitations' && (sortConfig.direction === 'ascending' ? '↑' : '↓')}
                    </TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedData.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="h-24 text-center">
                        No results found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    paginatedData.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.name}</TableCell>
                        <TableCell>{item.university}</TableCell>
                        <TableCell className="text-right">{item.totalCitations}</TableCell>
                        <TableCell>
                          <Link href={`/citers/${item.id}`}>
                            <Button variant="outline" size="sm">View Details</Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
                <TableCaption>
                  {sortedData.length > 0 && (
                    <div className="flex justify-between text-sm">
                      <span>Showing {Math.min(pageSize, sortedData.length - startIndex)} of {sortedData.length} entries</span>
                      <span>
                        Total Citations: {sortedData.reduce((sum, item) => sum + item.totalCitations, 0)}
                      </span>
                    </div>
                  )}
                </TableCaption>
              </Table>
            </div>
            
            {sortedData.length > 0 && (
              <div className="flex items-center justify-end space-x-2 py-4">
                <div className="flex-1 text-sm text-muted-foreground">
                  Page {currentPage} of {totalPages}
                </div>
                <Select
                  value={String(pageSize)}
                  onValueChange={(value) => {
                    setPageSize(Number(value));
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="h-8 w-[70px]">
                    <SelectValue placeholder={pageSize} />
                  </SelectTrigger>
                  <SelectContent side="top">
                    {[5, 10, 15, 20].map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={prevPage}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={nextPage}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
} 



// Add getServerSideProps to check authentication on each request
export async function getServerSideProps(context: GetServerSidePropsContext) {
  // Get the session or token from cookies
  const projectRef = process.env.NEXT_PUBLIC_SUPABASE_PROJECT_REF || process.env.SUPABASE_PROJECT_ID;
  const cookieName = `sb-${projectRef}-auth-token`;

  console.log('[getServerSideProps] Looking for cookie:', cookieName);
  console.log('[getServerSideProps] Cookie value:', context.req.cookies[cookieName]);

  const token = context.req.cookies[cookieName];
  console.log('[getServerSideProps] Token:', token);
  
  // If no token exists, redirect to login
  if (!token) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    };
  }
  
  // Since we're using mocked data and not pulling anything from the backend,
  // we just provide a mock user object
  return {
    props: {
      user: {
        id: '123',
        name: 'John Researcher',
      },
    },
  };
}