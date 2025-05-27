import { useState } from 'react';
import reactLogo from './assets/react.svg';
import viteLogo from '/vite.svg';
import './App.css';

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <div className="mb-2 p-2 block">
        <h1 className="text-xl text-gray-100 text-center font-sans font-medium">
          Chinese English Dictionary
        </h1>
      </div>

      <main className="block">
        <div className="p-2">
          <p className="mb-2 text-gray-200">
            Dictionary that looks up Pinyin and English definition of Chinese
            characters and phrases.
          </p>
          <form className="flex">
            <input
              id="character-input"
              className="mr-2 px-2 py-1 bg-gray-100 text-gray-950 flex-1 rounded-lg"
              type="text"
              placeholder="Enter a Chinese word or phrase"
            />

            <button className="px-2 py-1 bg-midnight-950 text-gray-100 rounded-lg">
              Search
            </button>
          </form>
        </div>
      </main>
    </>
  );
}

export default App;
