let $ = require('jQuery');
let gsi = require('./gsi/gsiparser.js')
let { verifyWallet } = require('./croak.js')

let { renderGame } = require('./pastgames.js')
let html2canvas = require('./html2canvas.min.js')

let firebase = require('./gsi/firebaseupdate.js')

const API_KEY = 'test_key._Ms_lKkeGhHuP.+BjP_H'

function pageLoaded() {
    
    $('#label-onchain').hide()

    setTimeout(() => {
        verifyWallet((userInfo) => {
            console.log('wallet verified')
            $('#label-onchain').show()
            if (localStorage.getItem("save_onchain") == null) {
                localStorage.setItem("save_onchain", true);
                $('#switch-onchain').attr("checked", true);
            }
            $('#wallet-info').text('Wallet connected: ' + userInfo.email + ' ' + userInfo.chain + ' ' + userInfo.network)
        })
    }, 500)

    $('#switch-onchain').change(function () {
        if(this.checked) {
            localStorage.setItem("save_onchain", true);
        } else {
            localStorage.setItem("save_onchain", false)
        }
    })
    
    $('#switch-onchain').attr("checked",localStorage.getItem("save_onchain"));

} 

function saveOnChain(game, key) {
    let e = $('<div  id="games-list">').appendTo('#game-nft-container')
    renderGame(game, 'game-nft')

    setTimeout(() => {
        html2canvas(e[0], {
            scale: 5
        }).then(canvas => {
            $('#game-nft-container').hide()
            canvas.toBlob(function(blob){
                firebase.uploadScoreToStorage(blob, key, async (imageUrl) => {
                    console.log(imageUrl)
                    mintNft(game, imageUrl, (mintData) => {
                        let walletId = localStorage.getItem('wallet_id')
                        airdropNft(mintData.id, walletId, (airdropData) => {
                            let onChainInfo = {
                                imageUrl: imageUrl,
                                walletId: walletId,
                                minted: true,
                                mintTxId: airdropData.mintTxId,
                                mintedTo: airdropData.mintedTo,
                                contractAddress: '0xD182Fa8CC6aB0aFc4a6207f0AAD1fBFD4AC61E1C',
                                tokenId: mintData.tokenId
                            }
                            firebase.setOnchainInfoGame(onChainInfo, key)
                        })
                    })
                })
              },'image/png');
        });
    }, 500)
   
}

function mintNft(game, imageUrl, callback) {
    let gameResult = 'Draw'
    if (game.game.t_score > game.game.ct_score && game.player.team == "T") {
        gameResult = 'Won'
    }
    if (game.game.t_score < game.game.ct_score && game.player.team == "T") {
        gameResult = 'Lost'
    }
    if (game.game.t_score > game.game.ct_score && game.player.team == "CT") {
        gameResult = 'Lost'
    }
    if (game.game.t_score < game.game.ct_score && game.player.team == "CT") {
        gameResult = 'Won'
    }
    const options = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          metadata: {
            attributes: [
              {trait_type: 'Kills', value: game.player.match_stats.kills},
              {trait_type: 'MVPs', value: game.player.match_stats.mvps},
              {trait_type: 'Score', value: game.player.match_stats.score},
              {trait_type: 'Result', value: gameResult, display_type: 'string'},
              {trait_type: 'Map', value: game.game.map, display_type: 'string'},
              {trait_type: 'Game mode', value: game.game.mode, display_type: 'string'},
              {trait_type: 'Player', value: localStorage.getItem("username"), display_type: 'string'},
            ],
            name: 'CSGO Scorecard',
            description: 'CSGO Scorecard for ' + localStorage.getItem("username"),
            image: imageUrl,
            external_url: 'https://csgolive-b4b34.firebaseapp.com/'
          },
          supply: 1,
          assetContractId: '62e51695d16b3f474df76208',
          reserveTokenDataId: '62e51667d16b3f474df761ff',
          reserveTokenDataAmount: 1
        })
      };
      
      fetch('https://be.namasteapis.com/blockchain/v1/token-data/create', options)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            callback(response.data.id)
        })
        .catch(err => console.error(err));
}

function airdropNft(tokenId, walletId, callback) {
    const options = {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'x-api-key': API_KEY,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          destinations: [walletId],
          amounts: [1],
          tokenDataId: tokenId
        })
      };
      
      fetch('https://be.namasteapis.com/blockchain/v1/airdrop/token-data', options)
        .then(response => response.json())
        .then(response => {
            console.log(response)
            callback(response.data[0])
        })
        .catch(err => console.error(err));
}

exports.pageLoaded = pageLoaded;
exports.saveOnChain = saveOnChain
