import { Star, Tag, Share2 } from 'lucide-react';

const SavedQuestionsPage = () => {
  const questions = [
    {
      id: 1,
      question: 'Explain the concept of closures in JavaScript',
      category: 'Technical',
      difficulty: 'Intermediate',
      saved: true,
    },
    // Add more questions
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Saved Questions</h1>

      <div className="grid gap-6">
        {questions.map((item) => (
          <div key={item.id} className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex justify-between items-start">
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-gray-900">
                  {item.question}
                </h3>
                <div className="flex items-center gap-4">
                  <span className="flex items-center gap-1 text-sm text-gray-600">
                    <Tag className="h-4 w-4" />
                    {item.category}
                  </span>
                  <span className="text-sm text-gray-600">
                    {item.difficulty}
                  </span>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 text-yellow-500 hover:bg-yellow-50 rounded-lg">
                  <Star className="h-5 w-5 fill-current" />
                </button>
                <button className="p-2 text-gray-400 hover:bg-gray-50 rounded-lg">
                  <Share2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SavedQuestionsPage;