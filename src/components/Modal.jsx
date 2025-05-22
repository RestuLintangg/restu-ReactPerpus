import React from "react";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  return (
    <>
      <style>{`
        .modal-overlay {
          position: fixed;
          inset: 0;
          background: rgba(0, 58, 122, 0.4); /* sedikit gelap dan biru */
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1050;
          backdrop-filter: blur(4px); /* blur background */
          animation: fadeInOverlay 0.3s ease forwards;
        }
        @keyframes fadeInOverlay {
          from {opacity: 0;}
          to {opacity: 1;}
        }
        .modal-container {
          background: #f0f9ff; /* biru sangat muda */
          border-radius: 20px;
          box-shadow: 0 12px 28px rgba(0, 99, 200, 0.25);
          max-width: 480px;
          width: 95%;
          animation: fadeInScale 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          border: 1.5px solid #74a9ff; /* border tipis biru */
          overflow: hidden;
        }
        @keyframes fadeInScale {
          from {
            opacity: 0;
            transform: scale(0.85);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .modal-header {
          padding: 1rem 1.25rem;
          background: #74a9ff;
          color: white;
          font-weight: 700;
          font-size: 1.25rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-top-left-radius: 20px;
          border-top-right-radius: 20px;
          box-shadow: inset 0 -2px 4px rgb(0 0 0 / 0.1);
        }
        .close-btn {
          background: transparent;
          border: none;
          font-size: 1.5rem;
          color: white;
          cursor: pointer;
          padding: 0;
          line-height: 1;
          transition: transform 0.2s ease, color 0.2s ease;
        }
        .close-btn:hover {
          color: #cce4ff;
          transform: rotate(90deg);
        }
        .modal-body {
          padding: 1.5rem 1.5rem;
          color: #1a3e72;
          font-size: 1rem;
        }
      `}</style>

      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-container"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={e => e.stopPropagation()}
        >
          <div className="modal-header">
            <h5 id="modal-title">{title}</h5>
            <button
              type="button"
              className="close-btn"
              aria-label="Close"
              onClick={onClose}
            >
              &times;
            </button>
          </div>
          <div className="modal-body">{children}</div>
        </div>
      </div>
    </>
  );
}
