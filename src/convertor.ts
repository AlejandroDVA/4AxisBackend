export const converterUF = (ufValue: number, valor: number): number => {
    const result = ufValue * valor;
    const roundedResult = Math.ceil(result);
    return roundedResult;
};

export const converterStringToNumber = (value: string) => {
    try {
        return parseFloat(value);
    } catch (error) {
        console.log("Error en el valor a convertir");
    }
    return null
}