import { Calendar, Clock, Award } from 'lucide-react';

const HistoryPage = () => {
  const sessions = [
    {
      id: 1,
      title: 'Frontend Developer Interview',
      date: '2024-02-10',
      duration: '45 min',
      score: 85,
      questions: 10,
    },
    // Add more history items
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Practice History</h1>

      <div className="grid gap-6">
        {sessions.map((session) => (
          <div key={session.id} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{session.title}</h3>
                <div className="mt-2 space-y-2">
                  <div className="flex items-center gap-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>{session.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span>{session.duration}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Award className="h-4 w-4" />
                    <span>Score: {session.score}%</span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HistoryPage;