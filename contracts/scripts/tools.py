from brownie import (
    VRFCoordinatorMock,
    LinkToken,
    Contract,
    accounts, 
    network, 
    config, 
    chain
)
from web3 import Web3

FORKED_LOCAL_BLOCKCHAIN = ['mainnet-fork', 'mainnet-fork-dev']
LOCAL_BLOCKCHAIN = ['development', 'ganache-local']
INITIAL_SUPPLY = 1000000000

def get_account(index=None, id=None):
    if index:
        return accounts[index]
    if id:
        return accounts.load(id)
    if network.show_active() in LOCAL_BLOCKCHAIN + FORKED_LOCAL_BLOCKCHAIN:
        return accounts[0]

    return accounts.add(config['wallets']['from_key'])

contract_to_mock = {
    "vrf_coordinator": VRFCoordinatorMock,
    "link_token": LinkToken
}

def get_contract(contract_name: str):
    contract_type = contract_to_mock[contract_name]
    if network.show_active() in LOCAL_BLOCKCHAIN:
        if len(contract_type) <= 0:
            deploy_mock(contract_name)
        contract = contract_type[-1]

    else:
        contract_address = config["networks"][network.show_active()][contract_name]
        contract = Contract.from_abi(contract_type._name, contract_address, contract_type.abi)

    return contract

def deploy_mock(contract_name: str):
    account = get_account()
    print('depolying mocks...{}'.format(contract_name))

    link_token = LinkToken.deploy({"from": account})
    VRFCoordinatorMock.deploy(link_token.address, {"from": account})

def move_blocks(amount):
    for block in range(amount):
        get_account().transfer(get_account(), 0)
    print(chain.height)

def fund_with_link(contract_address, account=None, link_token=None, amount=10*10**18): # 0.1lnk
    account = account if account else  get_account()
    link_token = link_token if link_token else get_contract("link_token")
    tx = link_token.transfer(contract_address, amount, {"from": account})
    # link_token_contract = interface.LinkTokenInterface(link_token.address) # ?
    # tx = link_token_contract.transfer(contract_address, amount, {"from": account})
    tx.wait(1)
    print("contract fund with link")
    return tx