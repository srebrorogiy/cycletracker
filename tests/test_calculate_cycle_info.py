import pytest
from tracker import calculate_cycle_info
from datetime import date

def test_predictions_value():
    start = date(2026, 10, 1)
    end = date(2026, 10, 6)

    result = calculate_cycle_info(start, end, 28)
    assert result["prediction"] == date(2026, 10, 29)
