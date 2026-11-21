export function FormateDate(date) {
    return new Date(date).toLocaleDateString("pt-br", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    })
}

export function FormateMonetaryValue(value) {
    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(value);
}