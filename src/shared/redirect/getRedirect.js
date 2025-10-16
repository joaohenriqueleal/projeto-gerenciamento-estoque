"use strict"


export default function getRedirect() {
    return JSON.parse(sessionStorage.getItem('redirect')) || true
}
