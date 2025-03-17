import logging
import uuid
from app.lib.supabase import supabase

logger = logging.getLogger(__name__)

class SupabaseService:
    async def insert_job(self, job_id, user_id, job_type, params=None):
        """
        Insert a new job into the jobs table
        Create a new job in the jobs table
        """
        try:
            job_id = str(uuid.uuid4()).lower()  # Ensure lowercase UUID
            data = {
                "id": job_id,
                "user_id": user_id,
                "job_type": job_type,
                "status": "pending",
                "params": params or {}
            }
            
            response = supabase.table("jobs").insert(data).execute()
            
            if hasattr(response, 'error') and response.error:
                logger.error(f"Error creating job in Supabase: {response.error}")
                return None
                
            logger.info(f"Job created in Supabase with job_id: {job_id}")
            return job_id
        except Exception as e:
            logger.error(f"Exception creating job in Supabase: {str(e)}")
            return None
    
    async def update_job_status(self, job_id, status, result=None):
        """
        Update job status in the jobs table
        """
        try:
            # Ensure job_id is lowercase for consistency
            job_id = str(job_id).lower()
            
            data = {
                "status": status,
                "updated_at": "now()"
            }
            
            response = supabase.table("jobs").update(data).eq("id", job_id).execute()
            
            if hasattr(response, 'error') and response.error:
                logger.error(f"Error updating job status in Supabase: {response.error}")
                return False
                
            logger.info(f"Job status updated to {status} for job_id: {job_id}")
            
            # If result is provided and status is completed or failed, save the result
            if result and status in ["completed", "failed", "success"]:
                await self.save_job_result(job_id, result)
                
            return True
        except Exception as e:
            logger.error(f"Exception updating job status in Supabase: {str(e)}")
            return False
    
    async def save_job_result(self, job_id, result):
        """
        Save job result to job_results table
        """
        try:
            # Ensure job_id is lowercase for consistency
            job_id = str(job_id).lower()
            
            data = {
                "job_id": job_id,
                "result": result
            }
            
            response = supabase.table("job_results").insert(data).execute()
            
            if hasattr(response, 'error') and response.error:
                logger.error(f"Error saving job result to Supabase: {response.error}")
                return False
                
            logger.info(f"Job result saved to Supabase for job_id: {job_id}")
            return True
        except Exception as e:
            logger.error(f"Exception saving job result to Supabase: {str(e)}")
            return False
    
    async def get_job(self, job_id):
        """
        Get job details from the jobs table
        """
        try:
            # Ensure job_id is lowercase for consistency
            job_id = str(job_id).lower()
            
            response = supabase.table("jobs").select("*").eq("id", job_id).execute()
            
            if hasattr(response, 'error') and response.error:
                logger.error(f"Error getting job from Supabase: {response.error}")
                return None
            
            if response.data and len(response.data) > 0:
                return response.data[0]
            
            return None
        except Exception as e:
            logger.error(f"Exception getting job from Supabase: {str(e)}")
            return None 