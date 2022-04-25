from brownie import Rating, accounts

def main():
    account = accounts[0]
    account1 = accounts[1]
    account2 = accounts[2]
    rating_contract = Rating.deploy({"from": account})

    transaction = rating_contract.registerItem(bytes("www.youtube.com", 'utf-8'), {"from":account1})
    transaction.wait(1)
    print(rating_contract.itemIdCounter())
    transaction = rating_contract.getRating(1, account1)
    transaction.wait(1)

    

