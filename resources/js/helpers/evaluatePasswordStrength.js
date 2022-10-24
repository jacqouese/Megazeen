function evaluatePasswordStrength(password) {
    let score = 0;
    if (password.length > 0) score++;

    if (password.length >= 8) score++;

    // has 2 digits
    if (/(?=.*[0-9].*[0-9]).{8,}$/.test(password)) score++;

    // has 1 special
    if (/(?=.*[!@#$&*]).{8,}$/.test(password)) score++;

    // 1 upper case
    if (/(?=.*[A-Z]).{8,}$/.test(password)) score++;

    if (/^(?=.*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9]).{14,}$/.test(password)) score++;

    return score;
}

export default evaluatePasswordStrength;
