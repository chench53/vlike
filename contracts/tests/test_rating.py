"""
    brownie test tests/test_rating.py -s
"""

from brownie import (
    Rating,
    exceptions,
    network,
)
import pytest

from scripts.tools import get_account


def test_rating():
    account = get_account()
    rating_contract = Rating.deploy({"from": account})

    user1 = get_account(1)
    user2 = get_account(2)

    # registerItem
    url = "https://www.youtube.com/embed/lRba55HTK0Q"
    tx = rating_contract.registerItem(url, {"from": account})
    tx.wait(1)
    itemId = tx.return_value
    assert itemId == 1

    ratingInfo = rating_contract.getRating(itemId, user1, {"from": user1})
    assert ratingInfo == (False, False)

    # rate
    rating = 1
    rating_contract.rate(itemId, 1, {"from": user1}).wait(1)

    ratingInfo = rating_contract.getRating(itemId, user1, {"from": user1})
    assert ratingInfo == (True, True)

    # count on dislike/like
    ratingCount = rating_contract.getRatingCount(itemId, {"from": user1})
    assert ratingCount == (0, 1)
