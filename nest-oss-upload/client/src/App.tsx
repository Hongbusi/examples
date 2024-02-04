import { ChangeEvent, useEffect, useState } from 'react'
import axios from 'axios'
import { calculateFileSamplingHash, ext } from './utils'
import { Input } from '@/components/ui/input'

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
        // 公共读取
        // setImageUrl(`${host}/${fileName}`)

        // 私有读取
        const response = await axios.get(`/api/oss/file/${fileName}`)
        setImageUrl(response.data)
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
