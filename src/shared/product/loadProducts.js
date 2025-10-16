"use strict"


export default function loadProducts(userName) {
    return JSON.parse(
        localStorage.getItem(`${userName}:products`)
    ) || []
}
