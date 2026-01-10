
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { MissionUpdate } from '@/services/updates';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ShieldCheck, Check, X, FileText, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ReviewUpdateDialog } from '@/components/admin/review-update-dialog';

export default function AdminDashboardPage() {
    const { user, token, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();
    const [pendingUpdates, setPendingUpdates] = useState<MissionUpdate[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [reviewingUpdate, setReviewingUpdate] = useState<MissionUpdate | null>(null);

    const fetchPendingUpdates = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const response = await fetch('/api/v1/admin/updates?status=pending', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                 const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || "Failed to fetch pending updates.");
                } else {
                    throw new Error("Received an unexpected response from the server.");
                }
            }
            const data = await response.json();
            if (data.success) {
                setPendingUpdates(data.data);
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (isAuthLoading) {
            return; 
        }
        if (user?.role === 'admin') {
            fetchPendingUpdates();
        } else if (user) { // Only redirect if user is loaded and not an admin
            toast.error("Access Denied. Admins only.");
            router.replace('/');
        } else { // If no user and auth is done loading, redirect
            router.replace('/login');
        }
    }, [user, token, isAuthLoading, router, fetchPendingUpdates]);
    
    const handleUpdateStatus = async (updateId: string, newStatus: 'approved' | 'rejected') => {
        if (!token) return;
        
        const originalUpdates = [...pendingUpdates];
        setPendingUpdates(currentUpdates => currentUpdates.filter(u => u._id !== updateId));

        if (reviewingUpdate?._id === updateId) {
            setReviewingUpdate(null);
        }

        try {
            const response = await fetch(`/api/v1/admin/updates/${updateId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    const errorData = await response.json();
                    throw new Error(errorData.error || `Failed to ${newStatus} update.`);
                } else {
                     throw new Error("Received an unexpected response from the server when updating status.");
                }
            }
            toast.success(`Update has been ${newStatus}.`);

        } catch (error: any) {
            toast.error(error.message);
            setPendingUpdates(originalUpdates);
        }
    };

    if (isAuthLoading || !user) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-15rem)]">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    if (user.role !== 'admin') {
        // The useEffect will have already initiated a redirect.
        // This is a fallback to prevent rendering anything for a non-admin.
        return null;
    }
    
    return (
        <div className="max-w-7xl mx-auto space-y-6">
             <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                    Admin Dashboard
                </h1>
                <p className="text-muted-foreground mt-1">
                    Review and approve user-submitted mission updates.
                </p>
            </header>
            
            <Card>
                <CardHeader>
                    <CardTitle>Pending Submissions</CardTitle>
                    <CardDescription>
                        {isLoading ? 'Loading...' : 
                            pendingUpdates.length > 0 
                            ? `You have ${pendingUpdates.length} update(s) awaiting your review.`
                            : "There are no pending submissions at this time."
                        }
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex items-center justify-center p-8">
                           <Loader2 className="h-12 w-12 animate-spin text-primary" />
                        </div>
                    ) : pendingUpdates.length > 0 ? (
                        <div className="border rounded-md">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Update Title</TableHead>
                                        <TableHead>Mission</TableHead>
                                        <TableHead>Author</TableHead>
                                        <TableHead>Submitted On</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {pendingUpdates.map(update => (
                                        <TableRow key={update._id}>
                                            <TableCell className="font-medium max-w-xs truncate" title={update.title}>{update.title}</TableCell>
                                            <TableCell>{update.mission?.missionName || 'N/A'}</TableCell>
                                            <TableCell>@{update.author?.username || 'N/A'}</TableCell>
                                            <TableCell>{format(new Date(update.createdAt), 'MMM d, yyyy')}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button variant="ghost" size="sm" onClick={() => setReviewingUpdate(update)}>
                                                        <Eye className="h-4 w-4 mr-1" /> Review
                                                    </Button>
                                                    <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(update._id, 'approved')}>
                                                        <Check className="h-4 w-4 mr-1" /> Approve
                                                    </Button>
                                                     <Button variant="destructive" size="sm" onClick={() => handleUpdateStatus(update._id, 'rejected')}>
                                                        <X className="h-4 w-4 mr-1" /> Reject
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    ) : (
                         <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg bg-card/50">
                            <FileText className="mx-auto h-12 w-12 mb-4" />
                            <h3 className="text-lg font-semibold">All Caught Up!</h3>
                            <p>There are no pending submissions to review.</p>
                        </div>
                    )}
                </CardContent>
            </Card>

            {reviewingUpdate && (
                <ReviewUpdateDialog
                    update={reviewingUpdate}
                    open={!!reviewingUpdate}
                    onOpenChange={(isOpen) => !isOpen && setReviewingUpdate(null)}
                    onUpdateStatus={handleUpdateStatus}
                />
            )}
        </div>
    );
}
