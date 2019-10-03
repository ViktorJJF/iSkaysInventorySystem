const updateStock = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log("gaa + aea = gaea");
            resolve();
        }, 2000);
    });
}

module.exports = {
    updateStock
}