
const API_KEY = 'test_key._Ms_lKkeGhHuP.+BjP_H'

const CHAIN = 'polygon'
const NETWORK = 'testnet'
const CLIENT_ID ='62e51663d16b3f474df761fc'
const CONTRACT_ID = '62e51695d16b3f474df76208'

let $ = require('jQuery');

async function saveOnchain() {

}

async function verifyWallet(walletVerifiedCallback) {
    $('#loading').show();

    let { croakWallet } = require('croak-wallet-sdk/wallet');

    console.log(location)
    await croakWallet.init({
        chain:CHAIN,
        authNetwork: NETWORK,
        clientIdentifier: CLIENT_ID
    }
    );

    console.log('init called')
    /* This is checking if the user is connected to the wallet. */
    let isConnected = await croakWallet.isConnected();

    /* This is checking if the user is connected to the wallet. If the user is not connected, it
    will show the connect modal. If the user is connected, it will get the user info and log it
    to the console. */
    console.log("isConnected : ", isConnected);

    if (!isConnected) {
        $('#loading').hide();
        croakWallet.showConnectModal();
    } else {
        let userInfo = await croakWallet.getUserInfo();
        console.log("userInfo : ", userInfo);
        
        let walletId = await croakWallet.getWalletID();
        console.log("walletId: ", walletId)

        userInfo.chain = CHAIN
        userInfo.network = NETWORK

        let walletLinked = localStorage.getItem('wallet_linked')

        if (walletLinked == null || walletLinked == false) {
            linkWallet(walletId, () => {
                $('#loading').hide();
                walletVerifiedCallback(userInfo)
            })
        } else {
            $('#loading').hide();
            walletVerifiedCallback(userInfo)
        }
    
  }
}

function linkWallet(walletId, callback) {
    const options = {
        method: 'POST',
        headers: {
            Accept: 'application/json', 
            'Content-Type': 'application/json',
            'x-api-key': API_KEY
        },
        body: JSON.stringify({walletId: walletId})
      };
      
    fetch('https://be.namasteapis.com/blockchain/v1/auth/verify-token', options)
        .then(response => response.json())
        .then(response => {
            localStorage.setItem('wallet_linked', true)
            localStorage.setItem('wallet_id', walletId)
            localStorage.setItem("save_onchain", true);
            callback()
        })
        .catch(err => console.error(err));
}

exports.verifyWallet = verifyWallet
exports.saveOnchain = saveOnchain