# Saving scores permanently on blockchain using croak APIs

Using csgolive, you can also save your csgo scorecard and other metadata when game ends (kills, scores, aces, rank etc) permanently on chain as NFTs. Your scorecard is saved as NFT image while kills, scores etc are also saved as NFT metadata.

Saving metadata onchain also allows you to compare your scores with other people (like how many % percent of users have 2 aces in a game). Such info is automatically shown by most of the NFT markeplaces from the NFT metadata.

Below is the detailed guide on how is Croak APIs are used to setup onchain saving of scores from wallet setup to nft minting.

### Creating account on croak and getting api key

```
curl --request POST \
     --url https://be.namasteapis.com/blockchain/v1/admin/setup \
     --header 'Accept: application/json' \
     --header 'Content-Type: application/json' \
     --data '
{
     "name": "csgolive",
     "poc": "Naman",
     "poc_email": "naman@ggtv.co"
}
'
```

This creates a new company account for `csgolive` in Croak and we get an X-API-KEY for further usage.

### setting up wallet for user

Add these scripts to your html

```
<script src=https://live-nft-hosted-assets.s3.ap-south-1.amazonaws.com/main.js></script>
<link rel="stylesheet" href="https://live-nft-hosted-assets.s3.ap-south-1.amazonaws.com/main.d86a3424.css"></link>
```

Now, if no wallet currently exists for user, we can request new wallet creation

```
// Initializes the wallet and sets network
await glipAuthGlobal.init('testnet','polygon',(loggedIn)=>{console.log(loggedIn);});

// Show the login modal on the screen
await glipAuthGlobal.showConnectModal(['google'])
```

