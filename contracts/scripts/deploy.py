from brownie import (
    Rating,
    VlikeToken,
    config,
    network
)
from web3 import constants, Web3

from .tools import get_account, INITIAL_SUPPLY

def deplopy_contract(contact_container, *args):
    account = get_account()
    contract = contact_container.deploy(*args, {"from": account}, 
        publish_source = config["networks"][network.show_active()].get("verify", False)
    )
    print("deployed {} contract at {}".format(contact_container._name, contract.address))
    return contract

def deplopy_all():
    token_contract = deplopy_contract(VlikeToken, Web3.toWei(INITIAL_SUPPLY, 'ether'))
    rating_contract = deplopy_contract(Rating, token_contract, False)
    return token_contract, rating_contract

def _setup(rating_contract, string):
    account = get_account()
    tx = rating_contract.registerItem(string, {"from": account})
    tx.wait(1)
    itemId = tx.return_value
    return itemId


def main():
    token_contract, rating_contract = deplopy_all()
    _setup(rating_contract, "https://www.youtube.com/embed/lRba55HTK0Q")
