




const waitForTimeout = (duration=1000, funcToRun) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(funcToRun && funcToRun())
        }, duration)
    })
}

module.exports = waitForTimeout