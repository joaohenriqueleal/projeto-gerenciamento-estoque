"use strict"


export default function setRedirect(value) {
    sessionStorage.setItem('redirect', JSON.stringify({redirect: value}))
}
