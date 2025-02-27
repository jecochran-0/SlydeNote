import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 text-gray-300 p-6 text-center shadow-2xl mt-12">
      <p className="text-lg">
        © {new Date().getFullYear()} SlydeNote. All rights reserved. |{" "}
        <Link
          href="/privatepolicy"
          className="text-gray-200 hover:text-blue-300 hover:underline underline-offset-4 transition-all duration-300"
        >
          Privacy Policy
        </Link>{" "}
        |{" "}
        <Link
          href="/terms-of-service"
          className="text-gray-200 hover:text-blue-300 hover:underline underline-offset-4 transition-all duration-300"
        >
          Terms of Service
        </Link>
      </p>
    </footer>
  );
}
