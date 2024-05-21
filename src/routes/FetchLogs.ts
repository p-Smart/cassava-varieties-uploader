import clientLog from "../utils/clientLog"
import withErrorHandler from "./errorHandler"


const FetchLogs = withErrorHandler(async (req, res) => {
    const reqId = req.params?.id
    const logs = clientLog.get(reqId)
    return {
        message: `Logs for ${reqId}`,
        data: logs
    }
})


export default FetchLogs