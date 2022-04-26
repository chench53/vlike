import json

from brownie import (
    Rating,
    Contract,
    exceptions,
    network,
)
import pytest

from scripts.tools import get_account

def main():
    path = '../frontend/src/apis/abi/rating.json'
    with open(path, 'r') as f:
        abi = json.load(f)
    contract_address = '0x3194cbdc3dbcd3e11a07892e7ba5c3394048cc87'
    contract = Contract.from_abi("Rating", contract_address, abi)
    user1 = get_account(1)
    print(user1)
    ratingInfo = contract.getUserRating(1, {"from": get_account(1)})
    print(ratingInfo)
