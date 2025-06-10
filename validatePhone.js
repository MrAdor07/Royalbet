const validatePhone = (phone) => {
    const regex = /^(\+8801|8801|01)[3-9]\d{8}$/;
    return regex.test(phone);
};

module.exports = validatePhone;