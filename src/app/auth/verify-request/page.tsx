export default function VerifyRequestPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <div className="w-full max-w-md rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">Check your email</h1>
        <p className="mt-2 text-sm text-gray-700">
          A sign-in link has been sent to your email address. Click the link to sign in.
        </p>
      </div>
    </div>
  )
}