import json
import re

from brownie import (
    Rating,
    RatingFactory,
    Pools,
    VlikeToken,
    config,
    network
)
from web3 import constants, Web3

from .tools import get_account, get_contract, fund_with_link, INITIAL_SUPPLY, LOCAL_BLOCKCHAIN

def deplopy_contract(contact_container, *args):
    account = get_account()
    contract = contact_container.deploy(*args, {"from": account}, 
        publish_source = config["networks"][network.show_active()].get("verify", False)
    )
    print("deployed {} contract at {}".format(contact_container._name, contract.address))
    return contract

def deplopy_all(enable_token_at_init=False, dice=100):
    token_contract = deplopy_contract(
        VlikeToken, 
        Web3.toWei(INITIAL_SUPPLY, 'ether'),
    )
    # pools_contract = deplopy_contract(
    #     Pools,
    #     token_contract
    # )
    rating_contract = deplopy_contract(
        Rating, 
        'dev',
        token_contract, 
        # pools_contract,
        enable_token_at_init,
        dice,
        get_contract("vrf_coordinator").address,
        get_contract("link_token").address,
        config["networks"][network.show_active()]["fee"],
        config["networks"][network.show_active()]["keyhash"],
    )
    rating_factory_contract = deplopy_contract(
        RatingFactory
    )
    return token_contract, rating_contract, rating_factory_contract
    # return {
    #     'token_contract': token_contract,
    #     'rating_contract': rating_contract,
    #     'rating_factory_contract': rating_factory_contract,
    # }

def _setup(rating_contract, string):
    account = get_account()
    tx = fund_with_link(rating_contract.address)
    tx = rating_contract.registerItem(string, {"from": account})
    tx.wait(1)
    if network.show_active() in LOCAL_BLOCKCHAIN:
        return {
            'item_id': tx.return_value
        }


def _write_frontend_end_env(token_contract, rating_contract, rating_factory_contract):
    env_file_content_fmt = '''
REACT_APP_API_URL={}
REACT_APP_CHAIN_NETWORK={}
REACT_APP_CONTRACT_RATING={}
REACT_APP_CONTRACT_RATING_FACTORY={}
REACT_APP_CONTRACT_VLIKE_TOKEN={}

    '''
    if network.show_active() in LOCAL_BLOCKCHAIN:
        path = '../frontend/.env.development.local'
        env_file_content = env_file_content_fmt.format(
            'http://localhost:8545',
            'dev',
            rating_contract.address, 
            rating_factory_contract.address, 
            token_contract.address,
            # pools_contract.address,
            )
    else:
        path = '../frontend/.env.production.local'
        env_file_content = env_file_content_fmt.format(
            '/chain',
            'rinkeby',
            rating_contract.address, 
            rating_factory_contract.address, 
            token_contract.address,
            # pools_contract.address,
            )
    
    with open(path, 'w') as f:
        f.write(env_file_content)
    print(f'wrote to {path} in {network.show_active()} done')

def _write_frontend_end_abi(*contracts):
    for contract in contracts:
        abi = contract.abi
        path = f'../frontend/src/apis/abi/{__sub_name(contract._name)}.json'
        with open(path, 'w') as f:
            json.dump(abi, f)
    print(f'wrote abi done')

def __sub_name(name):
    """
    RatingFactory ->rating_factory
    """
    return re.sub('([a-z])?([A-Z])', lambda x: (x.group(1) and (x.group(1).lower() + '_') or '') + x.group(2).lower(), name)

def main():
    token_contract, rating_contract, rating_factory_contract = deplopy_all()
    _setup(rating_contract, "https://www.youtube.com/embed/lRba55HTK0Q")
    _write_frontend_end_env(token_contract, rating_contract, rating_factory_contract)
    _write_frontend_end_abi(token_contract, rating_contract, rating_factory_contract)
