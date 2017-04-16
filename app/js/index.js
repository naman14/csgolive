/**
 * Created by naman on 16/4/17.
 */

if(localStorage.getItem("email") == null) {
    console.log("no local storage")
    location.href = "./html/login.html"
} else {
    console.log("loading home")
    location.href = "./html/home.html"
}