import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-gray-900 to-gray-800 text-white">
      {/* Header Section */}
      <Header />

      <div className="mt-24 flex flex-col items-center justify-center w-full px-6 py-12">
        <div className="w-40 h-40 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-gray-600 shadow-lg">
          <Image
            src="/Headshot3.png" // Replace with your actual image path
            alt="Profile Picture"
            width={200}
            height={200}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Name & Description */}
        <div className="text-center mt-6 max-w-2xl">
          <h1 className="text-4xl font-bold text-gray-100">Jake</h1>
          <p className="mt-4 text-lg leading-relaxed text-gray-300">
            Hey everyone, I'm a software developer who likes to make side
            projects like this one. If you like this, follow me on LinkedIn,
            shoot me a message, I love to hear from fellow programmers and see
            their work.
          </p>
        </div>

        {/* Social Links */}
        <div className="mt-6 flex space-x-6">
          {/* LinkedIn */}
          <Link
            href="https://www.linkedin.com/in/jake-cochran"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-blue-400 transition-transform transform hover:scale-110"
          >
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.761 0 5-2.239 5-5v-14c0-2.761-2.239-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.5c-.966 0-1.5-.724-1.5-1.5s.534-1.5 1.5-1.5c.966 0 1.5.724 1.5 1.5s-.534 1.5-1.5 1.5zm13.5 11.5h-3v-5.5c0-1.32-.81-2-1.88-2s-1.88.68-1.88 2v5.5h-3v-10h3v1.43c.57-.87 1.64-1.93 3.38-1.93 2.61 0 4.38 1.69 4.38 5.09v5.41z" />
            </svg>
          </Link>

          {/* GitHub */}
          <Link
            href="https://github.com/jecochran-0"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-300 hover:text-gray-400 transition-transform transform hover:scale-110"
          >
            <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.627 0-12 5.373-12 12 0 5.303 3.438 9.8 8.207 11.385.6.111.793-.261.793-.577 0-.285-.01-1.04-.015-2.04-3.338.725-4.042-1.608-4.042-1.608-.546-1.385-1.333-1.754-1.333-1.754-1.089-.744.083-.729.083-.729 1.205.084 1.84 1.24 1.84 1.24 1.07 1.835 2.805 1.304 3.49.997.108-.775.42-1.305.764-1.605-2.665-.305-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.236-3.22-.135-.303-.54-1.525.105-3.175 0 0 1.005-.322 3.3 1.23.957-.266 1.98-.398 3-.405 1.02.007 2.043.139 3 .405 2.295-1.552 3.3-1.23 3.3-1.23.645 1.65.24 2.872.105 3.175.77.84 1.236 1.91 1.236 3.22 0 4.608-2.805 5.625-5.475 5.92.43.37.81 1.102.81 2.22 0 1.605-.015 2.9-.015 3.295 0 .32.195.695.8.575 4.765-1.58 8.2-6.08 8.2-11.385 0-6.627-5.373-12-12-12z" />
            </svg>
          </Link>
        </div>
      </div>
    </div>
  );
}
