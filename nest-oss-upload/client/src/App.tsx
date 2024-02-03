import { Input } from '@/components/ui/input'
import { ChangeEvent, useEffect, useState } from 'react'
import { calculateFileSamplingHash, ext } from './utils'
import axios from 'axios'

export default function App() {
  const [imageUrl, setImageUrl] = useState('')
  const [ossSignature, setOssSignature] = useState<Record<string, string>>({})

  const fetchOssSignature = async () => {
    const response = await axios.get('/api/oss/signature')
    setOssSignature(response.data)
  }

  useEffect(() => {
    fetchOssSignature()
  }, [])

  const handleChangeFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (file) {
      const hash = await calculateFileSamplingHash(file)
  
      const fileName = `${hash}.${ext(file.name)}`

      const formData = new FormData()
      const { OSSAccessKeyId, policy, Signature, host } = ossSignature

      formData.append('key', fileName)
      formData.append('OSSAccessKeyId', OSSAccessKeyId)
      formData.append('policy', policy)
      formData.append('signature', Signature)
      formData.append('file', file)
      formData.append('success_action_status', '200')

      const res = await axios.post(host, formData)
      if (res.status === 200) {
        setImageUrl(`${host}/${fileName}`)
      }
    }
  }

  return (
    <main className="flex justify-center items-center h-screen">
      <div className="grid max-w-sm items-center gap-1.5">
        <Input id="picture" type="file" onChange={handleChangeFile} />
        <img src={imageUrl} />
      </div>
    </main>
  )
}
