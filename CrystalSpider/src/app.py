import os
import uvicorn
from fastapi import FastAPI
from fastapi_events.handlers.local import local_handler
from fastapi_events.middleware import EventHandlerASGIMiddleware
from starlette.middleware.sessions import SessionMiddleware
from fastapi.middleware.cors import CORSMiddleware
from common import env_init # noqa: F401
from routers import articles, internal, dangerous, crystal_gpt

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_middleware(SessionMiddleware, secret_key=os.getenv('SESSION_KEY'))
app.add_middleware(EventHandlerASGIMiddleware, handlers=[local_handler])

app.include_router(articles.router)
app.include_router(internal.router)
app.include_router(dangerous.router)
app.include_router(crystal_gpt.router)


if __name__ == '__main__':
    uvicorn.run("main:app", port=8080, host="0.0.0.0", reload=True)
