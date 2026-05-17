import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// Railway/その他PaaS が割り当てる PORT 環境変数を Vite 側で読み取る。
// allowedHosts: true は、PaaS の動的なドメイン (*.up.railway.app など) を
// Vite preview の Host チェックに引っかからないよう許可する設定。
export default defineConfig({
  plugins: [react(), tailwindcss()],
  preview: {
    host: true,
    port: process.env.PORT ? Number(process.env.PORT) : 4173,
    allowedHosts: true,
  },
})
