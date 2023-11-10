import '@/styles/globals.css';
import RouterGard from './authenticated/auth';


export default function App({ Component, pageProps }) {
  return (
    <RouterGard>
      <Component {...pageProps} />
    </RouterGard>
  );
}
