import pytest
from phases import phase_of_cycle
import csv

# def test_day_1_is_menstruation():
#     assert phase_of_cycle(1) == "Менструация"

# def test_day28_is_lut():
#     assert phase_of_cycle(28) == "Лютеиновая"

# @pytest.mark.parametrize("day, expected", [
#     (1, "Менструация"),
#     (5, "Менструация"),
#     (6, "Фолликулярная"),
#     (11, "Фолликулярная"),
#     (12, "Овуляция"),
#     (16, "Овуляция"),
#     (17, "Лютеиновая"),
#     (30, "Лютеиновая")
# ])

# def test_phase(day, expected):
#     assert phase_of_cycle(day) == expected

def loadTestData():
    with open("test_data.csv") as f:
        reader = csv.DictReader(f)
        testData = []
        for row in reader:
            tup = (int(row["day"]), row["expected"])
            testData.append(tup)
        return testData

loadTestData()

@pytest.mark.parametrize("day, expected", loadTestData())
def test_phase(day, expected):
    assert phase_of_cycle(day) == expected