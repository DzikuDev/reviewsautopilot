export function RecentReviews() {
  const reviews = [
    {
      id: '1',
      provider: 'Google',
      rating: 5,
      author: 'Alex M.',
      text: 'Fantastic service and friendly staff. Highly recommend!'
    },
    {
      id: '2',
      provider: 'Facebook',
      rating: 3,
      author: 'Jamie L.',
      text: 'The experience was okay, but room for improvement.'
    },
    {
      id: '3',
      provider: 'Google',
      rating: 1,
      author: 'Sam K.',
      text: 'Had an issue with my order and no one responded.'
    }
  ]

  return (
    <div className="mt-8">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Reviews</h2>
      <div className="grid grid-cols-1 gap-4">
        {reviews.map((r) => (
          <div key={r.id} className="rounded-lg border bg-white p-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="text-sm font-medium text-gray-900">{r.author}</div>
              <div className="text-xs text-gray-500">{r.provider}</div>
            </div>
            <div className="mt-1 text-sm text-gray-700">{r.text}</div>
            <div className="mt-2 text-xs text-gray-600">Rating: {r.rating} / 5</div>
          </div>
        ))}
      </div>
    </div>
  )
}