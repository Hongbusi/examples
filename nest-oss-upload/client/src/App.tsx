import { Input } from '@/components/ui/input'

export default function App() {
  return (
    <main className="flex justify-center items-center h-screen">
      <div className="grid w-full max-w-sm items-center gap-1.5">
        <Input id="picture" type="file" />
      </div>
    </main>
  )
}
