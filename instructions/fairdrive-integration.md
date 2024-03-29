## Short GetLogin (GL) explanation

Invite - this is the ETH wallet (w0) with some funds.

User receives the invite and create new wallet (w1), main wallet. The main amount of funds will be stored here.

User visit 3rd party app that wants to use user's funds. GL asks user if he trusts this app and allows to spend some
funds. If users trust this app GL creates session wallet (w3) and transfer some funds from w1 to w3.

Every 3rd party app registers allowed urls in GL contract. GL could share sensitive information (balances, private key)
only with sites that registered in the contract.

3rd party app could make transactions with this wallet, could receive w3 private key and use that funds for it own
purposes. For example, spend some xBzz for buying stamps.

## Reward system for FairDrive (FD) with GetLogin (GL)

0) FD developers integrate GL scripts to the site. Scripts allow interacting with user's info.
1) User visit FD site, click by "Get Reward" button.
2) GL scripts will return username hash (uniq identifier) and FD sessions wallet address.
3) FD sends this data to the reward server. The server will check if user exists in GL system (using GL's smart contract
   data).
4) If user/wallet exists and never received the reward, then the server will reward him with xDai and xBzz.
5) User could spend his reward at his discretion. But the main case for spending - exchange received funds to swarm postage
   stamps for storing his data.

Example or reward system implemented here: https://github.com/GetLoginEth/reward-system

Also in this example implemented methods for receiving invites information for user (getting invites list and their
statuses).

## How to manage SWARM postage stamps?

The creation of postage stamps for use in FairOS completely depends on the SWARM node through which it performs
operations. Therefore, the creation and storage of postage stamps for a specific user should be located on the server
side, on which the FairOS or SWARM node is located. It makes no sense to store stamps on the GetLogin side, since stamps
are known to nodes and can only be used with it.

To use stamps and GetLogin, a system must be implemented in FairOS and FairDrive that deducts xBZZ and xDai from the
user's account, converts them into stamps and stores them on the server along with the nodes.

In the example https://github.com/GetLoginEth/reward-system you could see how to receive session private key (w3) which
contains some xDai and xBzz that available only for current application.

## How to integrate GetLogin to FairOS or any backend?

Binding process

1) User login to FairOS
2) User create a request for GetLogin account binding
3) FairOS create some random data to sign which only correct for current FairOS user
4) User sign this data with his GetLogin account via web or any other way
5) User send signed data and his username to the server
6) Server get actual address (w1) for received username from GetLogin contract
7) If the data signed with w1, then FairOS bind GetLogin username to the current FairOS account

Login process

1) User choose login process via GetLogin in FairOS login options
2) FairOS ask GetLogin username, create some random data for this username and send it to the user
3) User should sign this data via web, Metamask or hard wallet and send it back to the server
4) Server will get w1 with GetLogin contract and validate signed data
5) If data signed correctly then the server should give access to the user
