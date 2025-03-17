from fastapi import FastAPI, Request, UploadFile, File
from fastapi.templating import Jinja2Templates
from starlette.staticfiles import StaticFiles

import os
from app.models.krat_pipeline_lab.pipe import prediction


app = FastAPI()
templates = Jinja2Templates(directory='templates')

base_dir = os.path.dirname(os.path.abspath(__file__))
static_path = os.path.abspath("static")
app.mount("/static", StaticFiles(directory=rf'{static_path}'), name="static")

UPLOAD_DIR = "server_files"


@app.get("/")
async def root(request: Request):
    return templates.TemplateResponse("index.html", {'request': request})


@app.post("/uploading_file")
async def uploading_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOAD_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
        print(buffer)
        result = prediction()
        return {'file': result}


# uvicorn app.main:app --reload
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )
