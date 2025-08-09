from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import uvicorn

# Model Input Schema
class ChatRequest(BaseModel):
    message: str
    mode: str = "text"

app = FastAPI()

# CORS setup
origins = [
    "https://smartburme.github.io",   # Your GitHub Pages domain
    "http://localhost:5500",          # local dev
    "*",                              # allow all (for dev only)
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"status": "ok", "service": "Wayne AI API"}

@app.post("/api/chat")
def chat_endpoint(req: ChatRequest):
    # For now, just echo back with AI-like reply
    if req.mode == "image":
        return {"reply": f"[Image generation for: {req.message}]"}
    elif req.mode == "code":
        return {"reply": f"Here is some pseudo code for: {req.message}\n\nprint('Hello World')"}
    else:
        return {"reply": f"WAYNE AI: I received your message '{req.message}' and I'm processing it."}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
