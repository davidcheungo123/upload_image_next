import type { NextPage } from 'next'
import React, {useState, useEffect} from 'react'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import fileDownload from 'js-file-download'


interface FormInputData {
  image : null|File
}

interface ErrorMessageData {
  state : boolean,
  message : string
}

const config = {
  headers: { 'content-type': 'multipart/form-data' },
  onUploadProgress: (event: React.FormEvent<HTMLInputElement>) => {
    console.log(`Current progress:`, Math.round((event.loaded * 100) / event.total));
  },
};

const Home: NextPage = () => {

  const initialState = {state : false , message : ""}

  const [formInputData, setFormInputData] = useState<FormInputData>({image : null})
  const [errorMessage , setErrorMessage] = useState<ErrorMessageData>(initialState)
  // const [imgSrc, setImgSrc] = useState<string>("")

  const onSubmit  = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const {image} = formInputData
    if (image === null || image.type !== "image/png") {
      setErrorMessage({state : true, message : "Please upload a png file instead"})
      return
    }
    const formData = new FormData()
    formData.append("image", image, image.name)
    const response = await axios.post("http://localhost:3000/api/to_jpeg", formData, config)
    console.log({response})
    console.log(response.data.message)
    const buff = Buffer.from(Object.values(response.data.message))
    const blob = new Blob([buff], {type: "image/jpeg"})
    console.log(response.data.name.match(/(.*?).png/)[1])
    fileDownload(blob, `${response.data.name.match(/(.*?).png/)[1]}.jpg`)
    e.target.reset()
    setFormInputData({image: null})
  }

  useEffect(() => {
    setErrorMessage(initialState)
    console.log(formInputData)
  }, [formInputData])

  return (
    <div className={styles.container}>
      Please Upload an image:
      <div>
        <form onSubmit={onSubmit} >
        <input type="file" id="file" onChange={(e) => setFormInputData({image : e.target.files ? e.target.files[0] : null})} />
        {errorMessage.state ? <span style={{color : 'red'}}>{errorMessage.message}</span> : null}
        <button type="submit" id="submit" disabled={formInputData.image ? false : true} >Submit</button>
        </form>
        {/* {imgSrc ? <img src={imgSrc} alt=""/> : null} */}
        </div>
    </div>
  )
}

export default Home
