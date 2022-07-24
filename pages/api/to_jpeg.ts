import nextConnect from "next-connect";
import multer from "multer";
import Jimp from 'jimp'


import type { NextApiRequest, NextApiResponse } from "next";


//https://betterprogramming.pub/upload-files-to-next-js-with-api-routes-839ce9f28430


const oneMegabyteInBytes = 1000000;
const outputFolderName = "./public/uploads"


const upload = multer({
    limits: { fileSize: oneMegabyteInBytes * 10 },
    storage: multer.diskStorage({
      destination: './public/uploads',
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
    // console.log(req.file, typeof req.file)
    Jimp.read(`./public/uploads/${req.file.originalname}`, (err, image) => {
        console.log(image.bitmap.data, typeof image.bitmap.data)
        if (err) res.status(500).json({message : "Something went wrong in backend"})
        image.getBuffer(Jimp.MIME_PNG, (err, buffer) => {
            if (err) res.status(500).json({message : "Something went wrong in backend"})
            res.status(200).json({ message: buffer, name : req.file.originalname});
        })
    })
});

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
