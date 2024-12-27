import { Calendar, Clock, Users } from 'lucide-react';

const SessionsPage = () => {
  const upcomingSessions = [
    {
      id: 1,
      title: 'Technical Interview Practice',
      date: '2024-02-15',
      time: '14:00',
      duration: '45 min',
      participants: 2,
    },
    // Add more sessions as needed
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Practice Sessions</h1>
        <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700">
          Schedule New Session
        </button>
      </div>

      <div className="grid gap-6">
        {upcomingSessions.map((session) => (
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
                    <span>{session.time} ({session.duration})</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Users className="h-4 w-4" />
                    <span>{session.participants} participants</span>
                  </div>
                </div>
              </div>
              <button className="px-4 py-2 text-indigo-600 hover:bg-indigo-50 rounded-lg">
                Join Session
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SessionsPage;