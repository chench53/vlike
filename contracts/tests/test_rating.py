"""
run tests:
    brownie test tests/test_rating.py -s
run a test function:
    brownie test tests/test_rating.py -k test_rating_with_tokens -s
"""

from brownie import (
    Rating,
    exceptions,
    network,
)
import pytest
from web3 import constants, Web3

from scripts.tools import get_account, LOCAL_BLOCKCHAIN
from scripts.deploy import deplopy_contract, deplopy_all, _setup


def test_rating():
    if network.show_active() not in LOCAL_BLOCKCHAIN:
        pytest.skip()

    account = get_account()
    user1 = get_account(1)
    user2 = get_account(2)

    rating_contract = deplopy_contract(Rating, constants.ADDRESS_ZERO, False)
    itemId = _setup(rating_contract, "https://www.youtube.com/embed/lRba55HTK0Q")

    # rating info on (hasVoted, rating)
    ratingInfo = rating_contract.getUserRating(itemId, {"from": user1})
    assert ratingInfo == (False, False)

    # rate
    rating = 1
    rating_contract.rate(itemId, 0, {"from": user1}).wait(1)

    # rating info on (hasVoted, rating)
    ratingInfo = rating_contract.getUserRating(itemId, {"from": user1})
    assert ratingInfo == (True, False)

    # count on dislike/like
    ratingCount = rating_contract.getRatingCount(itemId, {"from": user1})
    assert ratingCount == (1, 0)


def test_rating_with_tokens():
    if network.show_active() not in LOCAL_BLOCKCHAIN:
        pytest.skip()

    account = get_account()
    user1 = get_account(1)
    user2 = get_account(2)

    token_contract, rating_contract = deplopy_all()
    itemId = _setup(rating_contract, "https://www.youtube.com/embed/lRba55HTK0Q")


def test_rating_factory():
    if network.show_active() not in LOCAL_BLOCKCHAIN:
        pytest.skip()
    