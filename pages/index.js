import { useRouter } from 'next/router';

export default function TwoButtons() {
  const router = useRouter();

  const handleButtonClick = (path) => {
    router.push(path);
  };

  return (
    <div className="flex h-screen justify-center items-center bg-gray-100">
      <div className="flex space-x-4">
        <button
          onClick={() => handleButtonClick('/pmodule')}
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        >
          Procurement Module
        </button>
        <button
          onClick={() => handleButtonClick('/ops')}
          className="bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-700"
        >
          OPS Module
        </button>
      </div>
    </div>
  );
}