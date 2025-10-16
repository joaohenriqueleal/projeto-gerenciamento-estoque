"use strict"


export default function formatTimestamp(timestamp) {
    const date = new Date(timestamp)

    const ano = date.getFullYear()
    const mes = String(date.getMonth() + 1).padStart(2, '0')
    const dia = String(date.getDate()).padStart(2, '0')
    const hora = String(date.getHours()).padStart(2, '0')
    const minuto = String(date.getMinutes()).padStart(2, '0')
    const segundo = String(date.getSeconds()).padStart(2, '0')

    return `${ano}/${mes}/${dia}/${hora}:${minuto}:${segundo}`
}
