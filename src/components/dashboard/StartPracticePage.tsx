import { Link } from 'react-router-dom';

const StartPracticePage = () => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden flex flex-col items-center justify-center">
        <p>Start practice</p>
        <Link to="/dashboard/practice">
            <button className='button-primary group'>Start</button>
        </Link>
      </div>
    </div>
  );
};

export default StartPracticePage;