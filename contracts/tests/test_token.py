"""
run tests:
    brownie test tests/test_token.py -s
"""
from brownie import (
    Rating,
    VlikeToken,
    Pools,
    exceptions,
    network,
)
import pytest
from web3 import constants, Web3

from scripts.tools import get_account, get_contract, LOCAL_BLOCKCHAIN, INITIAL_SUPPLY
from scripts.deploy import deplopy_contract
from scripts.setup import allow_request

class TestToken():

    def setup_class(self):
        if network.show_active() not in LOCAL_BLOCKCHAIN:
            pytest.skip()
        print('setup')
        self.token_contract = deplopy_contract(
            VlikeToken, 
            Web3.toWei(INITIAL_SUPPLY, 'ether'),
        )

    def teardown_class(self):
        print('teardown')

    def test_request_tokens(self):
        user1 = get_account(1)
        token_contract = self.token_contract
        allow_request(token_contract, Web3.toWei(8, 'ether')).wait(1)
        allow_request(token_contract, Web3.toWei(100, 'ether')).wait(1)
        allow_request(token_contract, Web3.toWei(25, 'ether')).wait(1) # last allowance
        # allow_request(token_contract, Web3.toWei(2, 'ether')).wait(1)
        assert token_contract.balanceOf(user1) == 0

        tx = token_contract.requestTokens({'from': user1})
        tx.wait(1)

        assert token_contract.balanceOf(user1) == Web3.toWei(10, 'ether')

        tx = token_contract.requestTokens({'from': user1})
        with pytest.raises(exceptions.VirtualMachineError, match="insufficient allowance"):
            tx = token_contract.requestTokens({'from': user1})
