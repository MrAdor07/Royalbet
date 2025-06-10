const generateTrxId = () => {
    return 'TRX-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
};

module.exports = generateTrxId;