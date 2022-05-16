from brownie import (
    network
)

from .tools import LOCAL_BLOCKCHAIN, get_account

def add_items(rating_contract, *items):
    account = get_account()
    txs = []
    for i in items:
        rating_contract.registerItem(i, {"from": account})
    # tx.wait(1)
    # t = txs[-1]
    # t.wait(1)
    if network.show_active() in LOCAL_BLOCKCHAIN:
        return {
            'item_id': 't.return_value'
        }
