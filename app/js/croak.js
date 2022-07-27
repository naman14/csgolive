const API_KEY = 'test_key.uD+yT-9CJCCzwRAAiOq_'


async function saveOnchain() {

}

async function verifyWallet(walletVerifiedCallback) {
    let walletLinked = localStorage.getItem('wallet_linked')
    if (walletLinked == null || walletLinked == false) {
        await glipAuthGlobal.init('testnet','polygon', async (loggedIn) => {
            if (loggedIn) {
                let tokenData = await glipAuthGlobal.getGlipTokenData()
                linkWallet(tokenData.accessToken, walletVerifiedCallback)
            }           
        });
        await glipAuthGlobal.showConnectModal(['google'])
    } else {
        walletVerifiedCallback()
    }
   
}

function linkWallet(accessToken, callback) {
    const options = {
        method: 'POST',
        headers: {
            Accept: 'application/json', 
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
            'access-token': accessToken,
        },
      };
      
    fetch('https://be.namasteapis.com/blockchain/v1/auth/verify-token', options)
        .then(response => response.json())
        .then(response => {
            localStorage.setItem('wallet_linked', true)
            callback()
        })
        .catch(err => console.error(err));
}

exports.verifyWallet = verifyWallet
exports.saveOnchain = saveOnchain