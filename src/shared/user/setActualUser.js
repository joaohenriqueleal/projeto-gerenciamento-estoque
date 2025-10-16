"use strict"


export default function setActualUser(userName) {
    sessionStorage.setItem('actual_user', userName)
}
