from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from datetime import date
from tracker import calculate_cycle_info
from pydantic import BaseModel
from db import init_db, get_all_cycles, get_latest_cycle, save_cycle

app = FastAPI()
init_db()

saved_start_date = date(2026, 9, 4)
saved_end_date = date(2026, 9, 4)


class PeriodRequest(BaseModel):
    start_date: date
    end_date: date
    user_id: int

app.mount("/static", StaticFiles(directory="."), name="static")

@app.get("/")
def get_index():
    return FileResponse("index.html")

@app.get("/api/cycles")
def get_cycles(user_id:int):
    records = get_all_cycles(user_id)
    return [
        {
            "id": r[0],
            "start_date": r[1],
            "end_date": r[2]
        }
        for r in records
    ] 
    
# нам тут нужно получается чтобы пришедшая в боди дата была переделана в запрос в базу как прослойка превращения json в запрос?
# получается мы получили дату 

@app.post("/api/cycles")
def add_cycle(body: PeriodRequest):
    save_cycle(user_id=body.user_id, start_date=body.start_date, end_date=body.end_date, cycle_length=28) # возможно тут еще нужно user_id указывать 
    return calculate_cycle_info(start_date=body.start_date, end_date=body.end_date, cycle_length=28)

@app.get("/api/cycle-info")
def get_cycle_info(user_id:int):
    latest = get_latest_cycle(user_id)
    if latest:
        start_date = date.fromisoformat(latest[0])
        end_date = date.fromisoformat(latest[1])
        cycle_length = latest[2]
        return calculate_cycle_info(start_date=start_date, end_date=end_date, cycle_length=cycle_length)
    else:
        return calculate_cycle_info(start_date=saved_start_date, end_date=saved_end_date, cycle_length=28)
