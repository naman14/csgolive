/**
 * Created by naman on 16/4/17.
 */

if(localStorage.getItem("email") == null) {
    console.log("no local storage")
    location.href = "./html/login.html"
} else {
    console.log("loading home")
    if (location.hash) {
        console.log('detected web3 login hash in index')
        location.href = "./html/home.html" + `#${location.hash}`
    } else {
        location.href = "./html/home.html"
    }
}