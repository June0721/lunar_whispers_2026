import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
    // 加载环境变量
    const env = loadEnv(mode, process.cwd(), '')
    const apiUrl = env.VITE_API_URL || 'http://localhost:8000'

    return {
        plugins: [react()],
        server: {
            port: 5173,
            proxy: {
                '/api': {
                    target: apiUrl,
                    changeOrigin: true,
                }
            }
        }
    }
})
