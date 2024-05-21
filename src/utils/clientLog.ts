import { appCache } from "../app"



class ClientLogs {
    set(reqId: string, log: string) {
        if(!reqId){
            throw new Error('Request Id not set')
        }
        const logs = appCache.get(reqId) as string[] || []

        const newLogs = [...logs, log]
        appCache.set(reqId, newLogs)
        return newLogs
    }

    get(reqId: string) {
        if(!reqId){
            throw new Error('Request Id not set')
        }

        const logs = appCache.get(reqId) as string[] || []

        return logs
    }
}

export default new ClientLogs()