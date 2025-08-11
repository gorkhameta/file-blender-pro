import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Document {
  id: string;
  original_filename: string;
  file_size: number;
  file_type: string;
  storage_path?: string;
  created_at: string;
}

export interface ProcessingJob {
  id: string;
  document_id?: string;
  job_type: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  progress: number;
  output_path?: string;
  error_message?: string;
  created_at: string;
}

export function useDocuments() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [jobs, setJobs] = useState<ProcessingJob[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const createDocument = async (file: File): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('documents')
        .insert({
          user_id: user.id,
          original_filename: file.name,
          file_size: file.size,
          file_type: file.type,
        })
        .select()
        .single();

      if (error) throw error;
      
      setDocuments(prev => [...prev, data]);
      return data.id;
    } catch (error) {
      console.error('Error creating document:', error);
      toast({
        title: "Error",
        description: "Failed to save document",
        variant: "destructive",
      });
      return null;
    }
  };

  const createProcessingJob = async (
    documentId: string,
    jobType: string,
    inputParams?: any
  ): Promise<string | null> => {
    if (!user) return null;

    try {
      const { data, error } = await supabase
        .from('processing_jobs')
        .insert({
          user_id: user.id,
          document_id: documentId,
          job_type: jobType,
          status: 'pending',
          progress: 0,
          input_params: inputParams,
        })
        .select()
        .single();

      if (error) throw error;
      
      setJobs(prev => [...prev, data as ProcessingJob]);
      return data.id;
    } catch (error) {
      console.error('Error creating processing job:', error);
      toast({
        title: "Error",
        description: "Failed to create processing job",
        variant: "destructive",
      });
      return null;
    }
  };

  const updateJobProgress = async (jobId: string, progress: number, status?: string) => {
    try {
      const updates: any = { progress };
      if (status) updates.status = status;

      const { error } = await supabase
        .from('processing_jobs')
        .update(updates)
        .eq('id', jobId);

      if (error) throw error;

      setJobs(prev => prev.map(job => 
        job.id === jobId ? { ...job, ...updates } as ProcessingJob : job
      ));
    } catch (error) {
      console.error('Error updating job progress:', error);
    }
  };

  const completeJob = async (jobId: string, outputPath: string) => {
    try {
      const { error } = await supabase
        .from('processing_jobs')
        .update({
          status: 'completed',
          progress: 100,
          output_path: outputPath,
        })
        .eq('id', jobId);

      if (error) throw error;

      setJobs(prev => prev.map(job => 
        job.id === jobId 
          ? { ...job, status: 'completed' as const, progress: 100, output_path: outputPath }
          : job
      ));
    } catch (error) {
      console.error('Error completing job:', error);
    }
  };

  const fetchUserJobs = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('processing_jobs')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setJobs(data as ProcessingJob[]);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchUserJobs();
    }
  }, [user]);

  return {
    documents,
    jobs,
    isLoading,
    createDocument,
    createProcessingJob,
    updateJobProgress,
    completeJob,
    fetchUserJobs,
  };
}