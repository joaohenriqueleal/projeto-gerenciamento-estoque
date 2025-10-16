"use strict"


export default function saveUsers(newUsersList) {
    localStorage.setItem('users', JSON.stringify(newUsersList))
}
