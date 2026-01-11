
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/context/auth-context';
import { MissionUpdate } from '@/services/updates';
import { Loader2, FileText, Edit, Trash } from 'lucide-react';
import toast from 'react-hot-toast';
import { MyContributionCard } from '@/components/my-contribution-card';
import { EditSubmissionDialog } from '@/components/edit-submission-dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

export default function MyContributionsPage() {
    const { user, token, isLoading: isAuthLoading } = useAuth();
    const [updates, setUpdates] = useState<MissionUpdate[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const [editingUpdate, setEditingUpdate] = useState<MissionUpdate | null>(null);
    const [deletingUpdate, setDeletingUpdate] = useState<MissionUpdate | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);


    const fetchMyUpdates = useCallback(async () => {
        if (!token) return;
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/me/updates', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to fetch your contributions.");
            }
            const data = await response.json();
            setUpdates(data.data || []);
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [token]);

    useEffect(() => {
        if (!isAuthLoading && user) {
            fetchMyUpdates();
        }
    }, [user, isAuthLoading, fetchMyUpdates]);

    const handleEdit = (update: MissionUpdate) => {
        setEditingUpdate(update);
    };
    
    const handleUpdate = (updated: MissionUpdate) => {
        setUpdates(current => current.map(u => u._id === updated._id ? updated : u));
        fetchMyUpdates();
    };

    const handleDeleteConfirm = async () => {
        if (!deletingUpdate || !token) return;

        if (!deletingUpdate.mission || !deletingUpdate.mission.slug) {
            toast.error("Cannot delete: Mission data is missing or incomplete.");
            setIsSubmitting(false);
            setDeletingUpdate(null);
            return;
        }

        setIsSubmitting(true);
        const toastId = toast.loading("Deleting submission...");

        try {
            const response = await fetch(`/api/v1/missions/${deletingUpdate.mission.slug}/updates/${deletingUpdate._id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete submission.');
            }

            toast.success("Submission deleted.", { id: toastId });
            setUpdates(current => current.filter(u => u._id !== deletingUpdate._id));
            setDeletingUpdate(null);

        } catch (error: any) {
            toast.error(error.message, { id: toastId });
        } finally {
            setIsSubmitting(false);
        }
    };


    if (isLoading || isAuthLoading) {
        return (
            <div className="flex items-center justify-center min-h-[calc(100vh-15rem)]">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }
    
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <header className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
                    <FileText className="h-8 w-8 text-primary" />
                    My Contributions
                </h1>
                <p className="text-muted-foreground mt-1">
                    View and manage all your submitted mission updates.
                </p>
            </header>

            {updates.length > 0 ? (
                <div className="space-y-4">
                    {updates.map(update => (
                        <MyContributionCard
                            key={update._id}
                            update={update}
                            onEdit={() => handleEdit(update)}
                            onDelete={() => setDeletingUpdate(update)}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center text-muted-foreground p-12 border-2 border-dashed rounded-lg bg-card/50">
                    <FileText className="mx-auto h-12 w-12 mb-4" />
                    <h3 className="text-lg font-semibold">No Contributions Yet</h3>
                    <p>You haven't submitted any mission updates.</p>
                </div>
            )}
            
            {editingUpdate && (
                <EditSubmissionDialog
                    update={editingUpdate}
                    open={!!editingUpdate}
                    onOpenChange={(isOpen) => !isOpen && setEditingUpdate(null)}
                    onUpdate={handleUpdate}
                />
            )}

            <AlertDialog open={!!deletingUpdate} onOpenChange={(isOpen) => !isOpen && setDeletingUpdate(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete your
                            submission.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDeleteConfirm} disabled={isSubmitting}>
                             {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            Continue
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
