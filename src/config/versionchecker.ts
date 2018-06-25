const verionChecker = (current: string, target: string) => {
    const currentNum = parseInt(current.split('.').join(''), 10);
    const targetNum = parseInt(target.split('.').join(''), 10);
    return !(currentNum >= targetNum);
};

export default verionChecker;
