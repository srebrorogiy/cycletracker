import pytest
from pathlib import Path
from phases import phase_of_cycle
import csv

DATA_FILE = Path(__file__).parent/"test_data.csv"

def loadTestData():
    with open(DATA_FILE) as f:
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