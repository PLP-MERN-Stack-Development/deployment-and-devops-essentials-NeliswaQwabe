import { FaFacebookF, FaTwitter, FaInstagram, FaEnvelope } from 'react-icons/fa';

function Footer() {
  return (
    <footer className="bg-white dark:bg-gray-900 text-gray-700 dark:text-gray-300 py-3 px-4 flex flex-col items-center space-y-2 border-t text-sm">
      <div className="flex space-x-4 text-lg">
        <a href="mailto:hello@localpop.co.za" className="hover:text-green-600 dark:hover:text-green-400">
          <FaEnvelope />
        </a>
        <a href="https://facebook.com/localpop" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 dark:hover:text-green-400">
          <FaFacebookF />
        </a>
        <a href="https://twitter.com/localpop" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 dark:hover:text-green-400">
          <FaTwitter />
        </a>
        <a href="https://instagram.com/localpop" target="_blank" rel="noopener noreferrer" className="hover:text-green-600 dark:hover:text-green-400">
          <FaInstagram />
        </a>
      </div>
      <p>&copy; {new Date().getFullYear()} LocalPop. All rights reserved.</p>
    </footer>
  );
}

export default Footer;