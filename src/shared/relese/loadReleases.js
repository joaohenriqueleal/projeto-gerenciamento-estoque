"use strict"


export default function loadReleases(userName) {
    return JSON.parse(
        localStorage.getItem(`${userName}:releases`)
    ) || []
}
