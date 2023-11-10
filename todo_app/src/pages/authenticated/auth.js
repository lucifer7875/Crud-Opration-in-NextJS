import { useEffect } from 'react';
import { useRouter } from 'next/router';
import 'react-toastify/dist/ReactToastify.css';
import cookies from 'js-cookie';

function RouterGard({ children }) {
  const router = useRouter();
  useEffect(() => {
    const isLoginPage = router.pathname === '/';
    const isRegisterPage = router.pathname === '/register';

    // If the user is on the login or register page, no authentication check is needed.
    if (!(isLoginPage || isRegisterPage)) {
      // Perform your authentication check here

      const token = cookies.get('token');


      if (!token) {
        router.push('/');
      } else {
        fetch('http://localhost:5012/validateToken', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
          .then(response => {
            if (response.status !== 200) {
              // Token is invalid
            }
          })
          .catch(error => {
            console.log(error);
          });
      }
    }
  }, []);

  return <>{children}</>;
}

export default RouterGard;
