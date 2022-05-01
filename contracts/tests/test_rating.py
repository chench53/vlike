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
    itemId = _setup(rating_contract, "https://www.youtube.com/embed/lRba55HTK0Q")['item_id']

    # rating info on (hasVoted, rating)
    ratingInfo = rating_contract.getUserRating(itemId, {"from": user1})
    assert ratingInfo == (False, False)

    # rate
    rating = 1
    rating_contract.rate(itemId, rating, {"from": user1}).wait(1)

    # rating info on (hasVoted, rating)
    ratingInfo = rating_contract.getUserRating(itemId, {"from": user1})
    assert ratingInfo == (True, True)

    # count on dislike/like
    ratingCount = rating_contract.getRatingCount(itemId, {"from": user1})
    assert ratingCount == (0, 1)


def test_rating_with_tokens():
    if network.show_active() not in LOCAL_BLOCKCHAIN:
        pytest.skip()

    account = get_account() # owner of contracts
    user1 = get_account(1)
    user2 = get_account(2)

    token_contract, rating_contract = deplopy_all(True)
    itemId = _setup(rating_contract, "https://www.youtube.com/embed/lRba55HTK0Q")['item_id']

    stake_amount, vote_weight = rating_contract.calculateRatingStake(itemId)
    # print(stake_amount, vote_weight)
    token_contract.approve(rating_contract, stake_amount, {'from': user1})
    # print(token_contract.balanceOf(user1))
    # breakpoint()
    rating = 0
    with pytest.raises(exceptions.VirtualMachineError, match='transfer amount exceeds balance'):
        rating_contract.rate(itemId, rating, {"from": user1}).wait(1)

    token_contract.transfer(user1, Web3.toWei(10, 'ether'), {'from': account}).wait(1)
    rating_contract.rate(itemId, rating, {"from": user1}).wait(1)


def test_rating_factory():
    if network.show_active() not in LOCAL_BLOCKCHAIN:
        pytest.skip()
    