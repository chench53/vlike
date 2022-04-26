from brownie import Rating

from .tools import get_account

def main():
    account = get_account()
    # account1 = accounts[1]
    # account2 = accounts[2]
    rating_contract = Rating.deploy({"from": account})
    print(f'rating contract deployed: {rating_contract.address}')
    # transaction = rating_contract.registerItem(bytes("www.youtube.com", 'utf-8'), {"from":account1})
    # transaction.wait(1)
    # print(rating_contract.itemIdCounter())
    # transaction = rating_contract.getRating(1, {"from": account1})
    # transaction.wait(1)

    

