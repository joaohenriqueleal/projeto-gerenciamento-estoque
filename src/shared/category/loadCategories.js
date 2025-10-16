"use strict"


export default function loadCategories(userName) {
    return JSON.parse(
        localStorage.getItem(`${userName}:categories`)
    ) || []
}
