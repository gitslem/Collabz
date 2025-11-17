from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, EmailStr
from typing import Optional, List
import os
import json
from openai import OpenAI
from supabase import create_client, Client

app = FastAPI()

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize clients
openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError("OPENAI_API_KEY environment variable is required")

supabase_key = os.getenv("SUPABASE_KEY")
if not supabase_key:
    raise ValueError("SUPABASE_KEY environment variable is required")

openai_client = OpenAI(api_key=openai_api_key)
supabase: Client = create_client(
    os.getenv("SUPABASE_URL", "https://xiljhvtsanncqpjaydor.supabase.co"),
    supabase_key
)

# Models
class ProfileField(BaseModel):
    field_name: str
    value: str

class Profile(BaseModel):
    email: EmailStr
    name: str
    role: str
    genres_raw: str
    location: str
    availability: str
    skills_raw: str
    experience_level: str
    collab_type: str
    social_links: str

class MatchRequest(BaseModel):
    profile_id: str

class DeleteAccountRequest(BaseModel):
    user_id: str
    email: EmailStr

# Validation prompts
VALIDATION_PROMPTS = {
    "email": "Validate this email format strictly. Check if it's a valid email address (has @ symbol, domain, etc). Return JSON: {valid: true/false, message: 'explanation'}",
    "name": "Validate if this looks like a real person's name (not random text, numbers, or fake entries). It should have at least a first name, can include last name. Return JSON: {valid: true/false, message: 'explanation'}",
    "genres_raw": "Parse these music genres (comma-separated) and return a clean, standardized list. Return JSON: {genres: [...], valid: true/false}",
    "skills_raw": "Parse these music production skills (comma-separated) and standardize them. Return JSON: {skills: [...], valid: true/false}",
    "social_links": "Validate these social media URLs and extract platform names. Return JSON: {links: [{platform: str, url: str}], valid: true/false}",
}

@app.post("/validate-field")
async def validate_field(field: ProfileField):
    """Validate a single profile field using OpenAI"""
    try:
        prompt = VALIDATION_PROMPTS.get(field.field_name, f"Validate this {field.field_name}: ")
        
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a helpful data validator for music collaboration profiles. Be concise and return structured JSON when requested."},
                {"role": "user", "content": f"{prompt}{field.value}"}
            ],
            temperature=0.3
        )
        
        validation_result = response.choices[0].message.content
        
        return {
            "field": field.field_name,
            "original": field.value,
            "validation": validation_result,
            "valid": True
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Validation error: {str(e)}")

@app.post("/save-profile")
async def save_profile(profile: Profile):
    """Save profile to Supabase"""
    try:
        profile_data = profile.model_dump()
        result = supabase.table("profiles").insert(profile_data).execute()
        
        if not result.data:
            raise HTTPException(status_code=500, detail="Failed to save profile")
        
        profile_id = result.data[0].get("id")
        
        return {
            "success": True,
            "profile_id": profile_id,
            "message": "Profile saved successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Save error: {str(e)}")

@app.post("/find-matches")
async def find_matches(request: MatchRequest):
    """Find personalized matches using OpenAI"""
    try:
        profile_result = supabase.table("profiles").select("*").eq("id", request.profile_id).execute()
        
        if not profile_result.data:
            raise HTTPException(status_code=404, detail="Profile not found")
        
        user_profile = profile_result.data[0]
        all_profiles = supabase.table("profiles").select("*").neq("id", request.profile_id).execute()
        
        if not all_profiles.data:
            return {"matches": [], "message": "No other profiles found yet"}
        
        matching_prompt = f"""
        Given this user profile:
        - Role: {user_profile['role']}
        - Genres: {user_profile['genres_raw']}
        - Skills: {user_profile['skills_raw']}
        - Experience: {user_profile['experience_level']}
        - Collab Type: {user_profile['collab_type']}
        - Location: {user_profile['location']}

        And these potential collaborators:
        {all_profiles.data}

        Return the top 3 best matches with a compatibility score (0-100) and reasoning.
        Focus on complementary skills, genre overlap, and collaboration compatibility.
        Keep the reason concise (1-2 sentences max).
        Format as JSON: [{{"profile_id": "...", "name": "...", "score": 85, "reason": "..."}}, ...]
        """
        
        response = openai_client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {"role": "system", "content": "You are an expert at matching music collaborators based on complementary skills, genres, and preferences."},
                {"role": "user", "content": matching_prompt}
            ],
            temperature=0.7,
            response_format={"type": "json_object"}
        )

        matches_content = response.choices[0].message.content

        # Parse the JSON string from OpenAI
        try:
            matches_data = json.loads(matches_content)
        except json.JSONDecodeError:
            matches_data = {"matches": []}

        return {
            "success": True,
            "matches": matches_data,
            "user_profile": user_profile
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Matching error: {str(e)}")

@app.post("/delete-account")
async def delete_account(request: DeleteAccountRequest):
    """Delete user account and all associated data"""
    try:
        # Delete user profile from database
        delete_result = supabase.table("profiles").delete().eq("email", request.email).execute()

        if not delete_result.data:
            raise HTTPException(status_code=404, detail="Profile not found")

        # Note: Supabase auth user deletion should be handled on the frontend
        # using supabase.auth.admin.deleteUser() or via RLS policies

        return {
            "success": True,
            "message": "Account deleted successfully"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Delete error: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "healthy", "message": "Music collab API is running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
