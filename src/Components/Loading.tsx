import Loading from '../assets/Photos/LoadingT.png';

const LoadingScreen = () => {
  // Loading Screen
  return (
    <div className="loading-screen-overlay">
      <div className="loading-popup">
        <img src={Loading} alt="Loading" className="loading-image" />
      </div>
      <style>{`
        .loading-screen-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(200, 200, 200, 0.5); /* semi-transparent black background */
          display: flex;
          justify-content: center;
          align-items: center;
        }
        
        .loading-popup {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .loading-image {
          width: 100px;
          height: auto;
          margin-bottom: 10px;
          animation: blink-animation 1s infinite;
        }

        @keyframes blink-animation {
          0% { opacity: 0; }
          50% { opacity: 1; }
          100% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;