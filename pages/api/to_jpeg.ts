import nextConnect from "next-connect";
import multer from "multer";


import type { NextApiRequest, NextApiResponse } from "next";
import { Worker } from "worker_threads";

const oneMegabyteInBytes = 1000000;
const outputFolderName = "./public/uploads"


// runService for worker_threads:
const runService = (workerData) => {
    console.log("This is the runService method: ", workerData)
    return new Promise((resolve, reject) => {
      const worker = new Worker('./scripts/imageProcess.ts', { workerData });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
        if (code !== 0) reject(new Error(`Worker stopped with exit code ${code}`));
      })
    })
  }

// ../../scripts/imageProcess.ts

const upload = multer({
    limits: { fileSize: oneMegabyteInBytes * 10 },
    storage: multer.diskStorage({
      destination: outputFolderName,
      filename: (req, file, cb) => cb(null, file.originalname),
    }),
  });

  const apiRoute = nextConnect({
    onError(error, req: NextApiRequest, res: NextApiResponse) {
      res.status(501).json({ error: `Sorry something Happened! ${error.message}` });
    },
    onNoMatch(req: NextApiRequest, res: NextApiResponse) {
      res.status(405).json({ error: `Method '${req.method}' Not Allowed` });
    },
  });

const uploadMiddleware = upload.single("image")
apiRoute.use(uploadMiddleware)

apiRoute.post((req: NextApiRequest, res: NextApiResponse) => {

    async function distributeToWorker(req: NextApiRequest , res: NextApiResponse) {
    try {
        const {originalname} = req.file
        const result = await runService(originalname)
        console.log(result.message, typeof result.message)
        res.status(200).json({message : result.message, name: result.name})
    } catch (err) {
        console.error(err)
        res.status(500).json({message : "Something went wrong in backend"})
    }
    // Jimp.read(`./public/uploads/${req.file.originalname}`, (err, image) => {
    //     console.log(image.bitmap.data, typeof image.bitmap.data)
    //     if (err) res.status(500).json({message : "Something went wrong in backend"})
    //     image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
    //         if (err) res.status(500).json({message : "Something went wrong in backend"})
    //         res.status(200).json({ message: buffer, name : req.file.originalname});
    //     })
    // })
    }

    distributeToWorker(req, res)
})
    // console.log(req.file, typeof req.files

export const config = {
  api: {
    bodyParser: false, // Disallow body parsing, consume as stream
  },
};


export default apiRoute;
// import { request } from 'http'
// import type {NextApiRequest, NextApiResponse} from 'next'
// import {Worker} from 'worker_threads'
// import multer from 'multer'

// type Data = {
//     message : string
// }

// let storage = multer.memoryStorage()
// let upload = multer({storage: storage})

// export default (req: NextApiRequest, res: NextApiResponse<Data>) => {
//     if (req.method === "POST") {
//         console.log(upload.single("image"))

//         res.status(200).json({message: JSON.stringify(req.body)})
//     } else {
//         res.status(400).json({message : "methods other than POST are not allowed"})
//     }

//   }
