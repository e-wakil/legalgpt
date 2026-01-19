import { useState } from 'react';
import { Link } from "react-router-dom";
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom';
//logo
import { MdOutlineMenu as Menu } from "react-icons/md";
import { RxCross2 as X } from "react-icons/rx";
import { IoChevronDown } from "react-icons/io5";

//components
import ButtonFill from '../ui/Button';

//images
import logo from '../../assets/LegalGPT-Nepal.png'
//oauth
import { googleLogout, GoogleLogin } from '@react-oauth/google';
//zustand
import useUserStore from '../../store/userStore';
import axiosInstance from '../../api/axiosInstance';
//axiosInstance

interface NavLinkProps {
  to: string;
  label: string;
}

interface NavBarProps {
  to: string;
  label: string;
  hasDropdown?: boolean;
  subLinks?: NavLinkProps[];
}

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [activeMobileDropdown, setActiveMobileDropdown] = useState<string | null>(null);
  const navigate = useNavigate()
  //import user 
  const user = useUserStore(state => state.user)
  const removeUser = useUserStore(state => state.removeUser)
  const addUser = useUserStore(state => state.addUser)

  // console.log('user: ', user)

  const navLinks: NavBarProps[] = [
    { to: '/', label: 'Home' },
    {
      to: '/features',
      label: 'Features',
      hasDropdown: false,

    },
    {
      to: '/docs',
      label: 'Docs',
      hasDropdown: false,
    },
    { to: '/about', label: 'About us' },
    { to: '/contact', label: 'Contacts' },
  ];

  const toggleSidebar = () => setIsOpen(!isOpen);

  const closeSidebar = () => {
    setIsOpen(false);
    setActiveMobileDropdown(null);
  };

  const toggleMobileDropdown = (label: string) => {
    setActiveMobileDropdown(activeMobileDropdown === label ? null : label);
  };
  const logIn = async (credentialResponse: any) => {
    try {
      const response = await axiosInstance.post('/auth/google', { token: credentialResponse.credential })
      // console.log(response)
      localStorage.setItem('userToken', response.data.access_token)
      const user = response.data.user;
      addUser({ id: user.id, name: user.full_name, profile: user.picture_url, email: user.email })
      navigate('/chat')
    }
    catch (err) {
      console.log('error', err)
    }

  }

  //LOGOUT function
  const logOut = () => {
    googleLogout();
    localStorage.removeItem('userToken')
    removeUser();
    location.reload()

  }

  return (
    <>
      <nav className={`w-full h-16 md:h-20 shadow-sm sticky top-0 z-50 border-b ${isOpen ? 'bg-primary-dark' : 'bg-primary-dark'}`}>
        <div className="mx-4 sm:mx-8 md:mx-12 lg:mx-16 xl:mx-65 flex h-full justify-between items-center">

          {/* Logo */}
          <div className='flex items-center space-x-2'>
            <img src={logo} alt="LegalGPT Nepal Logo" className='h-10 w-10 md:h-12 md:w-12 rounded-full' />
            <span className='text-white font-bold text-lg md:text-xl'>
              LegalGPT-Nepal
            </span>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex justify-between items-center flex-1 ml-12 mr-12">
            {navLinks.map((link) => (
              <motion.div
                key={link.label}
                className="relative"
                whileHover={{ y: -2 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                onMouseEnter={() => link.hasDropdown && setActiveDropdown(link.label)}
                onMouseLeave={() => link.hasDropdown && setActiveDropdown(null)}
              >
                {link.hasDropdown ? (
                  <>
                    <button className="text-white hover:text-secondary transition-colors duration-200 px-3 py-2 text-sm xl:text-base font-medium flex items-center gap-1">
                      {link.label}
                      <IoChevronDown
                        className={`transition-transform duration-300 ${activeDropdown === link.label ? 'rotate-180' : ''
                          }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {activeDropdown === link.label && (
                      <motion.div
                        className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-100 py-2 animate-fadeIn min-w-[250px]">
                        {link.subLinks?.map((subLink) => (
                          <Link
                            key={subLink.label}
                            to={subLink.to}
                            className="block px-4 py-3 text-sm font-medium text-gray-700 hover:text-text hover:bg-gray-50 transition-all duration-200"
                          >
                            {subLink.label}
                          </Link>
                        ))}
                      </motion.div>
                    )}
                  </>
                ) : (
                  <Link
                    to={link.to}
                    className="text-white hover:text-secondary transition-colors duration-200 px-3 py-2 text-sm xl:text-base font-medium"
                  >
                    {link.label}
                  </Link>
                )}
              </motion.div>
            ))}
          </div>

          {/* Desktop Buttons */}
          <div className="hidden lg:flex gap-3 items-center">
            {/* <Link to='login'> */}
            {user?.name ? <ButtonFill content='Logout' onClick={() => logOut()} className='px-6' /> :
              <GoogleLogin onSuccess={credentialResponse => logIn(credentialResponse)} />
            }
            {/* </Link> */}
          </div>

          {/* Mobile/Tablet Menu Button */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 hover:bg-gray-700/50 rounded-lg transition-colors"
            aria-label="Toggle menu"
          >
            {isOpen ? (
              <X className="h-6 w-6 text-white" />
            ) : (
              <Menu className="h-6 w-6 text-white" />
            )}
          </button>
        </div>
      </nav>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
          onClick={closeSidebar}
        />
      )}

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-primary-dark shadow-2xl z-50 transform transition-transform duration-300 ease-in-out lg:hidden overflow-y-auto ${isOpen ? 'translate-x-0' : 'translate-x-full'
          }`}
      >
        {/* Sidebar Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className='flex items-center space-x-2'>
            <img src={logo} alt="LegalGPT Nepal Logo" className='h-10 w-10 rounded-full' />
            <h2 className="text-lg font-bold text-white">LegalGPT-Nepal</h2>
          </div>
          <button
            onClick={closeSidebar}
            className="p-2 text-text cursor-pointer hover:text-secondary rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X className="h-6 w-6 " />
          </button>
        </div>

        {/* Sidebar Navigation Links */}
        <div className="flex flex-col p-6 space-y-2 pb-32">
          {navLinks.map((link) => (
            <motion.div
              key={link.label}
              whileHover={{ x: 8 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {link.hasDropdown ? (
                <>
                  {/* Expandable Dropdown */}
                  <button
                    onClick={() => toggleMobileDropdown(link.label)}
                    className="w-full flex items-center justify-between text-text hover:text-secondary  transition-all duration-200 px-4 py-3 rounded-lg text-base font-medium"
                  >
                    <span>{link.label}</span>
                    <IoChevronDown
                      className={`transition-transform duration-300 ${activeMobileDropdown === link.label ? 'rotate-180' : ''
                        }`}
                    />
                  </button>

                  {/* Mobile Submenu */}
                  {activeMobileDropdown === link.label && (
                    <div className="ml-4 mt-2 space-y-1">
                      {link.subLinks?.map((subLink) => (
                        <Link
                          key={subLink.label}
                          to={subLink.to}
                          onClick={closeSidebar}
                          className="block hover:text-primary hover:bg-gray-50 transition-all duration-200 px-4 py-2 rounded-lg text-sm font-medium text-gray-600"
                        >
                          {subLink.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={link.to}
                  onClick={closeSidebar}
                  className="block text-text hover:text-secondary  transition-all duration-200 px-4 py-3 rounded-lg text-base font-medium"
                >
                  {link.label}
                </Link>
              )}
            </motion.div>
          ))}
        </div>

        {/* Sidebar Buttons */}
        <div className="absolute bottom-0 left-0 right-0 p-6  ">
          <Link to='signup'>
            <ButtonFill content='Signup' className='w-full text-center mb-4' onClick={closeSidebar} />
          </Link>
          <Link to='login'>
            <ButtonFill content='Login' className='w-full text-center' onClick={closeSidebar} />
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;