
const API_KEY = 'test_key.uD+yT-9CJCCzwRAAiOq_'

async function saveOnchain() {

}

async function verifyWallet(walletVerifiedCallback) {
    let { croakWallet } = require('croak-wallet-sdk/wallet');

    console.log(location)
    await croakWallet.init({
        chain:'polygon',
        authNetwork: 'testnet',
        clientIdentifier: '62dfb4b2908167125627c136'
    }
    );

    console.log('init called')
    /* This is checking if the user is connected to the wallet. */
    let isConnected = await skadiWallet.isConnected();

    /* This is checking if the user is connected to the wallet. If the user is not connected, it
    will show the connect modal. If the user is connected, it will get the user info and log it
    to the console. */
    console.log("isConnected : ", isConnected);
    if (!isConnected) {
        croakWallet.showConnectModal();
    } else {
        let userInfo = await croakWallet.getUserInfo();
        console.log("userInfo : ", userInfo);
        let walletId = await croakWallet.getWalletID();
        console.log("walletId: ", walletId)

        let walletLinked = localStorage.getItem('wallet_linked')

        if (walletLinked == null || walletLinked == false) {
            linkWallet(walletId, walletVerifiedCallback)
        } else {
            walletVerifiedCallback()
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
            callback()
        })
        .catch(err => console.error(err));
}

exports.verifyWallet = verifyWallet
exports.saveOnchain = saveOnchain