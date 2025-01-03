import { Link } from 'react-router-dom';

const StartPracticePage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col items-center justify-center min-h-[500px] h-auto p-6 md:p-12">
        <p className='text-lg font-semibold mb-4'>Start practice</p>
        <Link to="/dashboard/practice">
            <button className='button-primary group'>Start</button>
        </Link>
      </div>
    </div>
  );
};

export default StartPracticePage;