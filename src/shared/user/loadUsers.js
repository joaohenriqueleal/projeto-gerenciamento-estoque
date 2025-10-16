"use strict"


export default function loadUsers() {
    return JSON.parse(localStorage.getItem('users')) || []
}
