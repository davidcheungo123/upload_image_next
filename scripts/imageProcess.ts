const { workerData, parentPort } = require('worker_threads')
const Jimp = require("jimp")


console.log("This is the worker file and the workerData is: ", workerData)

Jimp.read(`./public/uploads/${workerData}`, (err, image) => {
    // console.log(image.bitmap.data, typeof image.bitmap.data)
    if (err) throw new Error(err)
    image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
        if (err) throw new Error(err)
        parentPort?.postMessage({ message: buffer, name : workerData})
    })
})