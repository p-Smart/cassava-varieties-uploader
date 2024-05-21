



type WaitForTimeoutType = (duration?: number, funcToRun?: Function) => Promise<void>

const waitForTimeout: WaitForTimeoutType = (duration=1000, funcToRun) => {
    return new Promise(resolve => {
        setTimeout(() => {
            resolve(funcToRun && funcToRun())
        }, duration)
    })
}

export default waitForTimeout