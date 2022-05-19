from brownie import (
    network
)

from .tools import LOCAL_BLOCKCHAIN, get_account

def add_items(rating_contract, *items):
    account = get_account()
    txs = []
    for i in items:
        t = rating_contract.registerItem(i, {"from": account})
        txs.append(t)
    if network.show_active() in LOCAL_BLOCKCHAIN:
        # return {
        #     'item_id': t.return_value
        # }
        return {
            'items': [{'id': t.return_value} for t in txs]
        }

def allow_request(token_contract, amount):
    account = get_account()
    tx = token_contract.approve(token_contract, amount, {'from': account})
    return tx
