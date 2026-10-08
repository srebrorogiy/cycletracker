from datetime import date, timedelta
from pydantic import BaseModel
from phases import phase_of_cycle

test_start = date(2026, 9, 4)
test_end = date(2026, 9, 10)

def calculate_cycle_info(start_date: date, end_date: date, cycle_length: int):
    current_date = date.today() - start_date
    current_date = current_date.days + 1

    cycle_length = timedelta(days=cycle_length)
    prediction = start_date + cycle_length


    countDaysToNextPeriod = (prediction - date.today()).days

    ovulation_date = prediction - timedelta(days=14)

    current_phase = phase_of_cycle(current_date)
    return {
        "start_date": str(start_date),
        "end_date": str(end_date),
        "current_date": current_date,
        "prediction": prediction,
        "ovulation_date": ovulation_date,
        "countDaysToNextPeriod": countDaysToNextPeriod,
        "phase": current_phase
    }

# def save_new_cycle():


if __name__ == "__main__":
    result = calculate_cycle_info(test_start, test_end, 28)
    print(result)