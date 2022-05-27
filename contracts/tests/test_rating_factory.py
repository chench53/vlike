"""
run tests:
    brownie test tests/test_rating_factory.py -s
run a test function:
    brownie test tests/test_rating_factory.py -k test_rating_factory -s
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
import pytest
from web3 import constants, Web3

from scripts.tools import get_account, get_contract, LOCAL_BLOCKCHAIN, INITIAL_SUPPLY
from scripts.deploy import deplopy_contract


class TestRatingFactory():

    def setup_class(self):
        if network.show_active() not in LOCAL_BLOCKCHAIN:
            pytest.skip()
        print('setup')

        self.token_contract = deplopy_contract(
            VlikeToken, 
            Web3.toWei(INITIAL_SUPPLY, 'ether'),
        )
        self.rating_factory_contract = deplopy_contract(
            RatingFactory
        )

    def teardown_class(self):
        print('teardown')

    def test_rating_factory(self):
        user1 = get_account(1)
        token_contract = self.token_contract
        rating_factory_contract = self.rating_factory_contract
        name = 'unittest'
        tx = rating_factory_contract.createRatingSystemContract(
            name,
            token_contract,
            False,
            100,
            5, 
            get_contract("vrf_coordinator").address,
            get_contract("link_token").address,
            # config["networks"][network.show_active()]["fee"],
            config["networks"][network.show_active()]["keyhash"],
            {'from': user1}
        )
        tx.wait(1)
        # print(tx.return_value)
        assert tx.return_value

        assert rating_factory_contract.getContractCount(user1) == 1
        assert rating_factory_contract.getContract(user1, 0) == tx.return_value

        with pytest.raises(exceptions.VirtualMachineError, match = 'index') as e: 
            rating_factory_contract.getContract(user1, 1)
