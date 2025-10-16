"use strict"


export default function loadActualUser() {
    return sessionStorage.getItem('actual_user') || null
}
