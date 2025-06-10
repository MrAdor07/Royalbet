const convertCurrency = (amount, fromRate, toRate) => {
    return (amount / fromRate) * toRate;
};

module.exports = convertCurrency;