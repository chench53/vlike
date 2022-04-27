from brownie import (
    Rating,
    config,
    network
)

from .tools import get_account

def deplopy_contract(contact_container, *args):
    account = get_account()
    contract = contact_container.deploy(*args, {"from": account}, 
        publish_source = config["networks"][network.show_active()].get("verify", False)
    )
    print("deployed {} contract at {}".format(contact_container._name, contract.address))
    return contract

def setup(rating_contract):
    account = get_account()
    url = "https://www.youtube.com/embed/lRba55HTK0Q"
    tx = rating_contract.registerItem(url, {"from": account})
    tx.wait(1)


def main():
    rating_contract = deplopy_contract(Rating)
    setup(rating_contract)
