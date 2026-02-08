/**
 * Formata um número para o padrão de moeda brasileiro (BRL).
 */
export const formatCurrency = (value: number | string): string => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numericValue)) return 'R$ 0,00';

    return new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
    }).format(numericValue);
};

/**
 * Formata um número decimal com precisão fixa.
 */
export const formatNumber = (value: number | string, decimals: number = 2): string => {
    const numericValue = typeof value === 'string' ? parseFloat(value) : value;

    if (isNaN(numericValue)) return '0,00';

    return new Intl.NumberFormat('pt-BR', {
        minimumFractionDigits: decimals,
        maximumFractionDigits: decimals,
    }).format(numericValue);
};
