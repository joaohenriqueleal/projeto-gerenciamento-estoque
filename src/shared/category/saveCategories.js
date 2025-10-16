"use strict"


export default function saveCategories(userName, categoriesList) {
    localStorage.setItem(`${userName}:categories`, JSON.stringify(
        categoriesList
    ))
}
