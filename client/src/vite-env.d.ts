/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SERVER_URL: string
  readonly VITE_GEMINI_API_KEY?: string
  // 추가 환경 변수가 있다면 여기에 정의
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

// CSS 모듈 타입 정의
declare module '*.css' {
  const content: string
  export default content
}

// 이미지 타입 정의
declare module '*.png' {
  const content: string
  export default content
}

declare module '*.jpg' {
  const content: string
  export default content
}

declare module '*.jpeg' {
  const content: string
  export default content
}

declare module '*.svg' {
  const content: string
  export default content
}

declare module '*.gif' {
  const content: string
  export default content
}
