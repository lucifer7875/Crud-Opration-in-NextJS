import cookies from 'js-cookie';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import Image from 'next/image'
import Logo from '../../assets/logo1.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'

const Header = () => {
  const router = useRouter();
  const isDashboard = router.pathname === '/dashboard';
  const handleLogOut = () => {
    cookies.remove('token')
    toast.success('Logout successful')
    setTimeout(() => {
      Router.push('/')
    }, 1000);
  }

  return (<>
    <ToastContainer limit={1} theme="colored" autoClose={1000} />
    <nav className={`bg-black p-4`}>
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <Link href="/dashboard" className="text-white text-2xl font-bold">
            <Image
              src={Logo}
              alt="Picture of the author"
              className='logo_Image_showNav w-20'
            />
          </Link>
        </div>
        <ul className="flex space-x-4">
          <li>
            <Link href="/dashboard" className={`${isDashboard ? 'text-black bg-white' : 'text-white'}  hover:text-black hover:bg-white font-bold py-2 px-4 rounded`}>
              Home
            </Link>
          </li>
          <li>
            <Link href="/users-list" className={`${router.pathname === '/users-list' ? 'text-black bg-white' : 'text-white'}  hover:text-black hover:bg-white font-bold py-2 px-4 rounded`}>
              Users List
            </Link>
          </li>
          <li>
            <Link href="/test-user-list" className={`${router.pathname === '/test-user-list' ? 'text-black bg-white' : 'text-white'}  hover:text-black hover:bg-white font-bold py-2 px-4 rounded`} title='check How to getServerSideProps work'>
              Test Page
            </Link>
          </li>
          {/* <li>
            <Link href="/test-form/add" className={`${router.pathname === '/test-form/add' ? 'text-black bg-white' : 'text-white'}  hover:text-black hover:bg-white font-bold py-2 px-4 rounded`} title='check How to getServerSideProps work'>
              Test Form
            </Link>
          </li> */}
          <li>
            <Link href="" className="text-white hover:text-white hover:bg-red-500 font-bold py-2 px-4 rounded">
              <span onClick={handleLogOut}>
                Logout
              </span>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  </>
  );
};

export default Header;
