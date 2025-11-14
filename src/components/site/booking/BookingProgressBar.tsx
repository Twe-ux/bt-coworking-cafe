'use client';

interface BookingProgressBarProps {
  currentStep: 1 | 2 | 3 | 4;
}

const steps = [
  { number: 1, label: 'Espace' },
  { number: 2, label: 'Date' },
  { number: 3, label: 'Détails' },
  { number: 4, label: 'Paiement' },
];

export default function BookingProgressBar({ currentStep }: BookingProgressBarProps) {
  const progressPercentage = ((currentStep - 1) / (steps.length - 1)) * 100;

  return (
    <div className="booking-progress-bar mb-4">
      {/* Progress bar line */}
      <div className="progress-line-container position-relative mb-3">
        <div className="progress-line-background"></div>
        <div
          className="progress-line-fill"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Step labels */}
      <div className="d-flex justify-content-between">
        {steps.map((step) => (
          <div
            key={step.number}
            className={`step-label text-center ${
              step.number === currentStep
                ? 'active'
                : step.number < currentStep
                ? 'completed'
                : 'pending'
            }`}
          >
            <div className="step-circle-wrapper d-flex justify-content-center mb-2">
              <div className="step-circle">
                {step.number < currentStep ? (
                  <i className="bi bi-check"></i>
                ) : (
                  step.number
                )}
              </div>
            </div>
            <div className="step-text">{step.label}</div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .booking-progress-bar {
          padding: 20px 0;
        }

        .progress-line-container {
          height: 4px;
          margin-bottom: 15px;
        }

        .progress-line-background {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 4px;
          background-color: #e0e0e0;
          border-radius: 2px;
        }

        .progress-line-fill {
          position: absolute;
          top: 0;
          left: 0;
          height: 4px;
          background-color: #5cb85c;
          border-radius: 2px;
          transition: width 0.3s ease;
        }

        .step-label {
          flex: 1;
          position: relative;
        }

        .step-circle-wrapper {
          position: relative;
        }

        .step-circle {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 14px;
          transition: all 0.3s ease;
          background-color: #e0e0e0;
          color: #666;
        }

        .step-label.active .step-circle {
          background-color: #5cb85c;
          color: white;
          box-shadow: 0 0 0 4px rgba(92, 184, 92, 0.2);
        }

        .step-label.completed .step-circle {
          background-color: #5cb85c;
          color: white;
        }

        .step-text {
          font-size: 13px;
          color: #999;
          font-weight: 500;
        }

        .step-label.active .step-text {
          color: #333;
          font-weight: 600;
        }

        .step-label.completed .step-text {
          color: #666;
        }

        @media (max-width: 576px) {
          .step-text {
            font-size: 11px;
          }

          .step-circle {
            width: 28px;
            height: 28px;
            font-size: 12px;
          }
        }
      `}</style>
    </div>
  );
}
