"""
run tests:
    brownie test tests/test_rating.py -s
run a test function:
    brownie test tests/test_rating.py -k test_rating_with_tokens -s
"""

from brownie import (
    Rating,
    VlikeToken,
    RatingFactory,
    exceptions,
    network,
    config,
)
import pytest
from web3 import constants, Web3

from scripts.tools import get_account, get_contract, LOCAL_BLOCKCHAIN, INITIAL_SUPPLY
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

    token_contract, rating_contract, _ = deplopy_all(True)
    itemId = _setup(rating_contract, "https://www.youtube.com/embed/lRba55HTK0Q")['item_id']

    stake_amount, vote_weight = rating_contract.calculateRatingStake(itemId)
    token_contract.approve(rating_contract, stake_amount, {'from': user1})
    rating = 0
    with pytest.raises(exceptions.VirtualMachineError, match='transfer amount exceeds balance'):
        rating_contract.rate(itemId, rating, {"from": user1}).wait(1)

    token_contract.transfer(user1, Web3.toWei(10, 'ether'), {'from': account}).wait(1)
    tx = rating_contract.rate(itemId, rating, {"from": user1})

    request_id = tx.events["stakeEvent"]["requestId"]

    STATIC_RNG = 666

    tx_vrf = get_contract("vrf_coordinator").callBackWithRandomness(
        request_id, STATIC_RNG, rating_contract.address, {"from": account}
    )

    # breakpoint()
    stake_info = rating_contract.itemPoolMapping(1, rating, 0)
    assert stake_info[3: 5] == [1, 1] # voteWeight, votes
    assert 'rewardEvent' not in tx.events

    # user2
    stake_amount2, vote_weight = rating_contract.calculateRatingStake(itemId)
    token_contract.approve(rating_contract, stake_amount2, {'from': user2})
    token_contract.transfer(user2, Web3.toWei(10, 'ether'), {'from': account}).wait(1)
    tx = rating_contract.rate(itemId, rating, {"from": user2})

    STATIC_RNG = 200

    tx_vrf = get_contract("vrf_coordinator").callBackWithRandomness(
        request_id, STATIC_RNG, rating_contract.address, {"from": account}
    )
    assert tx_vrf.events["rewardEvent"]['rewardAmount'] == stake_amount + stake_amount2
    with pytest.raises(exceptions.VirtualMachineError): # pool is reset
        rating_contract.itemPoolMapping(1, rating, 0)


def test_rating_factory():
    if network.show_active() not in LOCAL_BLOCKCHAIN:
        pytest.skip()
    token_contract = deplopy_contract(
        VlikeToken, 
        Web3.toWei(INITIAL_SUPPLY, 'ether'),
    )
    rating_factory_contract = deplopy_contract(
        RatingFactory
    )
    name = 'unittest'
    tx = rating_factory_contract.createRatingSystemContract(
        name,
        token_contract,
        False,
        100,
        get_contract("vrf_coordinator").address,
        get_contract("link_token").address,
        config["networks"][network.show_active()]["fee"],
        config["networks"][network.show_active()]["keyhash"],
    )
    tx.wait(1)
    print(tx.return_value)
    assert tx.return_value
    assert rating_factory_contract.ratingArray(0)