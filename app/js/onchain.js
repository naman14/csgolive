let $ = require('jQuery');
let gsi = require('./gsi/gsiparser.js')
let { verifyWallet } = require('./croak.js')

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
    
exports.pageLoaded = pageLoaded;