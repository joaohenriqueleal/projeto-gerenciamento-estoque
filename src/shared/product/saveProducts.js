"use strict"


export default function saveProducts(userName, productsList) {
    localStorage.setItem(`${userName}:products`, JSON.stringify(
        productsList
    ))
}
