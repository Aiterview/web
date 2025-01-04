import { BrainCog } from 'lucide-react';
import { Link } from 'react-router-dom';

const StartPracticePage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col items-center justify-center min-h-[500px] h-auto p-6 md:p-12">
        <BrainCog className="h-10 w-10 mb-2 text-gray-600 opacity-20" />
        <p className='text-gray-600 text-sm font-normal mb-8'>Click the button below to start your training and take the first step toward landing your dream job!</p>
        <Link to="/dashboard/practice">
            <button className='button-primary group'>Practice</button>
        </Link>
      </div>
    </div>
  );
};

export default StartPracticePage;