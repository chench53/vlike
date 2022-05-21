import json
import re
from tokenize import Token

from brownie import (
    Rating,
    RatingFactory,
    Pools,
    VlikeToken,
    Contract,
    config,
    network
)
from web3 import constants, Web3

from .tools import get_account, get_contract, fund_with_link, INITIAL_SUPPLY, LOCAL_BLOCKCHAIN
from .setup import add_items, allow_request

default_deployment_config = {
    'allow': 1000000,
    'rating_contracts': [
        {
            'enable_token_at_init': False,
            'items': [
                '<iframe width="560" height="315" src="https://www.youtube.com/embed/lRba55HTK0Q" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>',
                '<blockquote class="twitter-tweet" data-theme="dark"><p lang="en" dir="ltr">The bots are angry at being counted 🤣</p>&mdash; Elon Musk (@elonmusk) <a href="https://twitter.com/elonmusk/status/1525305145239781377?ref_src=twsrc%5Etfw">May 14, 2022</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>'
            ]
        },
        {
            'enable_token_at_init': True,
            'items': [
                '<iframe id="reddit-embed" src="https://www.redditmedia.com/r/ProgrammerHumor/comments/us7av8/i_think_i_use_it_too_much/?ref_source=embed&amp;ref=share&amp;embed=true&amp;theme=dark" sandbox="allow-scripts allow-same-origin allow-popups" style="border: none;" scrolling="no" width="640" height="504"></iframe>'
            ]
        },
    ]
}

def deplopy_contract(contact_container, *args):
    account = get_account()
    contract = contact_container.deploy(*args, {"from": account}, 
        publish_source = config["networks"][network.show_active()].get("verify", False)
    )
    print("deployed {} contract at {}".format(contact_container._name, contract.address))
    return contract

def _deplopy_all():
    account = get_account()
    token_contract = deplopy_contract(
        VlikeToken, 
        Web3.toWei(INITIAL_SUPPLY, 'ether'),
    )
    rating_factory_contract = deplopy_contract(
        RatingFactory
    )
    return token_contract, rating_factory_contract


def _get_rating(rating_factory_contract, user, index=0):
    rating_contract_address = rating_factory_contract.UserAddressToContractAddress(user, index)
    rating_contract = Contract.from_abi('rating', rating_contract_address, Rating.abi)
    return rating_contract

def _setup(token_contract, rating_factory_contract, default_deployment_config):
    account = get_account()
    allow_request(token_contract, Web3.toWei(default_deployment_config['allow'], 'ether'))
    for index, r in enumerate(default_deployment_config['rating_contracts']):
        rating_factory_contract.createRatingSystemContract(
            'dev',
            token_contract, 
            r['enable_token_at_init'],
            100,
            5,
            get_contract("vrf_coordinator").address,
            get_contract("link_token").address,
            config["networks"][network.show_active()]["keyhash"],
            {'from': account}
        ).wait(1)
        rating_contract = _get_rating(rating_factory_contract, account, index)
        # for item in r['items']:
        add_items(rating_contract, *r['items'])
        if r['enable_token_at_init']:
            fund_with_link(rating_contract.address) # link token trequired

def _write_frontend_end_env(token_contract, rating_factory_contract):
    account = get_account()
    env_file_content_fmt = '''
REACT_APP_API_URL={}
REACT_APP_CHAIN_NETWORK={}
REACT_APP_CONTRACT_RATING_FACTORY={}
REACT_APP_CONTRACT_VLIKE_TOKEN={}
REACT_APP_ADMIN_ADDRESS={}
    '''
    if network.show_active() in LOCAL_BLOCKCHAIN:
        path = '../frontend/.env.development.local'
        env_file_content = env_file_content_fmt.format(
            'http://localhost:8545',
            'dev',
            rating_factory_contract.address, 
            token_contract.address,
            account
        )
    else:
        path = '../frontend/.env.production.local'
        env_file_content = env_file_content_fmt.format(
            '/chain',
            'rinkeby',
            rating_factory_contract.address, 
            token_contract.address,
            account
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

def _write_frontend_end_mock():
    path = f'../frontend/src/apis/ether-config.json'
    with open(path, 'r') as f:
        ether_config = json.load(f)
    ether_config['networks']['dev']['vrf_coordinator'] = get_contract("vrf_coordinator").address
    ether_config['networks']['dev']['link_token'] = get_contract("link_token").address

    with open(path, 'w') as f:
        json.dump(ether_config, f, indent=2)
    print(f'wrote mock done')

def __sub_name(name):
    """
    RatingFactory ->rating_factory
    """
    return re.sub('([a-z])?([A-Z])', lambda x: (x.group(1) and (x.group(1).lower() + '_') or '') + x.group(2).lower(), name)

def main():
    token_contract, rating_factory_contract = _deplopy_all()
    _setup(token_contract, rating_factory_contract, default_deployment_config)
    _write_frontend_end_env(token_contract, rating_factory_contract)
    _write_frontend_end_abi(VlikeToken, Rating, RatingFactory)
    _write_frontend_end_mock()
