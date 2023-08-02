import { useState } from "react"

export function useSpecState(baseSpec) {
  const [spec, setSpec] = useState(baseSpec)
  return { spec, setSpec }
}
