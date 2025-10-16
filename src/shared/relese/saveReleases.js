"use strict"


export default function saveReleases(userName, releasesList) {
    localStorage.setItem(
        `${userName}:releases`, JSON.stringify(releasesList)
    )
}
