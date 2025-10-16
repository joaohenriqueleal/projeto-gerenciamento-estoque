"use strict"


export default function formatarBR(valor) {
    const numero = parseFloat(valor)
    if (isNaN(numero)) return 'R$ 0,00'
    return String(`R$${new Intl.NumberFormat('pt-BR', 
        {
            minimumFractionDigits: 2, maximumFractionDigits: 2
        }).format(numero)}`)
}
