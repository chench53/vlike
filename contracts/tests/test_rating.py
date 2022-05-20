"""
run tests:
    brownie test tests/test_rating.py -s
run a test function:
    brownie test tests/test_rating.py -k test_rating_no_tokens -s
    brownie test tests/test_rating.py -k test_rating_with_tokens -s
"""

from brownie import (
    Rating,
    RatingFactory,
    VlikeToken,
    Pools,
    Contract,
    exceptions,
    network,
    config,
)
from eth_account import Account
import pytest
from web3 import constants, Web3

from scripts.tools import get_account, get_contract, fund_with_link, LOCAL_BLOCKCHAIN, INITIAL_SUPPLY
from scripts.deploy import deplopy_contract, _deplopy_all, _get_rating
from scripts.setup import add_items


def setup_module():
    print('setup_module')
    global token_contract
    global rating_factory_contract
    token_contract = deplopy_contract(
        VlikeToken, 
        Web3.toWei(INITIAL_SUPPLY, 'ether'),
    )
    rating_factory_contract = deplopy_contract(
        RatingFactory
    )

class TestRating():

    def setup_class(self):
        if network.show_active() not in LOCAL_BLOCKCHAIN:
            pytest.skip()
        print('setup')


    def teardown_class(self):
        print('teardown')

    def test_rating_no_tokens(self):
        account = get_account()
        user1 = get_account(1)
    
        name = 'unittest'
        # rating_contract = deplopy_contract(
        #     Rating,
        #     name,
        #     token_contract,
        #     False,
        #     100,
        #     5,
        #     get_contract("vrf_coordinator").address,
        #     get_contract("link_token").address,
        #     config["networks"][network.show_active()]["keyhash"],
        #     get_account()
        # )

        rating_factory_contract.createRatingSystemContract(
            name,
            token_contract,
            False,
            100,
            5,
            get_contract("vrf_coordinator").address,
            get_contract("link_token").address,
            config["networks"][network.show_active()]["keyhash"],
        ).wait(1)

        rating_contract = _get_rating(rating_factory_contract, account, 0)

        items = add_items(rating_contract, "abc", "xyz")['items']
        # print(items)
        assert len(items) == 2
        itemId = items[0]['id']

        base_info = rating_contract.getBaseInfo()
        print(base_info)
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


    def test_rating_with_tokens(self):
        account = get_account() # owner of contracts
        user1 = get_account(1)
        user2 = get_account(2)

        rating_factory_contract.createRatingSystemContract(
            'dev',
            token_contract, 
            True,
            100,
            5,
            get_contract("vrf_coordinator").address,
            get_contract("link_token").address,
            config["networks"][network.show_active()]["keyhash"],
            {'from': account}
        ).wait(1)

        rating_contract = _get_rating(rating_factory_contract, account, 0)

        pools_contract_address = rating_contract.pools()
        pools_contract = Contract.from_abi('pools', pools_contract_address, Pools.abi)
        itemId = add_items(rating_contract, "abc")['items'][0]['id']
        fund_with_link(rating_contract.address)
        # print(rating_contract.getBaseInfo())
        base_info = rating_contract.getBaseInfo()
        assert base_info[3] == Web3.toWei(10, 'ether') # linktoken

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
        stake_info = pools_contract.itemPoolMapping(itemId, rating, 0)
        assert 'voteEvent' in tx_vrf.events
        assert 'rewardEvent' not in tx_vrf.events
        assert stake_info[4: 6] == [1, 1] # voteWeight, votes

        # user2
        stake_amount2, vote_weight = rating_contract.calculateRatingStake(itemId)
        token_contract.approve(rating_contract, stake_amount2, {'from': user2})
        token_contract.transfer(user2, Web3.toWei(10, 'ether'), {'from': account}).wait(1)
        tx = rating_contract.rate(itemId, rating, {"from": user2})

        STATIC_RNG = 200

        tx_vrf = get_contract("vrf_coordinator").callBackWithRandomness(
            request_id, STATIC_RNG, rating_contract.address, {"from": account}
        )
        assert tx_vrf.events["rewardEvent"]['rewardAmount'] == (stake_amount + stake_amount2) * 0.95
        # breakpoint()
        with pytest.raises(exceptions.VirtualMachineError): # pool is reset
            pools_contract.itemPoolMapping(itemId, rating, 0)
