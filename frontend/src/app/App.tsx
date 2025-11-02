import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes';
import { RouterProvider } from 'react-router-dom';
import '../styles/jido-theme.css';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5분
      retry: (failureCount, error: any) => {
        // 429/5xx 에러는 백오프로 처리
        if (error?.error_code === 'RATE_429' || error?.error_code === 'LLM_5XX') {
          return failureCount < 3;
        }
        return failureCount < 1;
      },
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}

export default App;
