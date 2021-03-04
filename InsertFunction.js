exports = function(payload, response) {
        // Payload body is a JSON string, convert into a JavaScript Object
        const data = JSON.parse(payload.body.text())
        const documents = []
        documents.push(data)
        // Perform operations as a bulk
        const bulkOp = context.services.get("mongodb-atlas").db("Integration").collection("eventbridge").initializeOrderedBulkOp()
        documents.forEach((document) => {
            bulkOp.insert(document)
        })
        response.addHeader(
            "Content-Type",
            "application/json"
        )
        bulkOp.execute().then(() => {
            // All operations completed successfully
            response.setStatusCode(200)
            response.setBody(JSON.stringify({
                timestamp: (new Date()).getTime()
            }))
            return
        }).catch((error) => {
            // Catch any error with execution and return a 500
            response.setStatusCode(500)
            response.setBody(JSON.stringify({
                timestamp: (new Date()).getTime(),
                errorMessage: error
            }))
            return
        })
};
