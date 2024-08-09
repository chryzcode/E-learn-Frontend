import React from "react";

const Spinner = () => {
  return (
    <div className="spinner-overlay">
      <div className="dots-container">
        <div className="dot dot1"></div>
        <div className="dot dot2"></div>
        <div className="dot dot3"></div>
      </div>
      <style jsx>{`
        .spinner-overlay {
          position: fixed;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .dots-container {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dot {
          width: 10px;
          height: 10px;
          background-color: black;
          border-radius: 50%;
          margin: 0 5px;
          animation: bounce 0.6s infinite alternate;
        }

        .dot1 {
          animation-delay: 0s;
        }

        .dot2 {
          animation-delay: 0.2s;
        }

        .dot3 {
          animation-delay: 0.4s;
        }

        @keyframes bounce {
          to {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </div>
  );
};

export default Spinner;
