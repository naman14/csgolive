/**
 * Created by naman on 16/4/17.
 */

if(localStorage.getItem("email") == null) {
    console.log("no local storage")
    location.href = "login.html"
} else {
    location.href = "home.html"
}