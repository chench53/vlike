"""
    this script is for debug purpose only
"""

import json

from brownie import (
    Rating,
    Contract,
    exceptions,
    network,
)
import pytest

from scripts.tools import get_account

def abi():
    path = '../frontend/src/apis/abi/rating.json'
    with open(path, 'r') as f:
        abi = json.load(f)
    contract_address = '0x3194cbdc3dbcd3e11a07892e7ba5c3394048cc87'
    contract = Contract.from_abi("Rating", contract_address, abi)
    user1 = get_account(1)
    print(user1)
    ratingInfo = contract.getUserRating(1, {"from": get_account(1)})
    print(ratingInfo)

def reg():
    rating = Rating[-1]
    url = "https://www.youtube.com/embed/lRba55HTK0Q"
    tx = rating.registerItem(url, {"from": get_account()})
    tx.wait(1)
    itemId = tx.return_value
    print(itemId)

def flash_abi():
    mypath = 'build/contracts/RatingFactory.json'
    with open(mypath, 'r') as f:
        build = json.load(f)
        abi = build['abi']
    path = '../frontend/src/apis/abi/rating_factory.json'
    with open(path, 'w') as f:
        json.dump(abi, f)

def main():
    # reg()
    flash_abi()