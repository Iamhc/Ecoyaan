import { useRouter } from 'next/router';

const steps = [
  { label: 'Cart', path: '/' },
  { label: 'Shipping', path: '/shipping' },
  { label: 'Payment', path: '/payment' },
];

export default function Stepper() {
  const router = useRouter();
  const currentIndex = steps.findIndex(s => s.path === router.pathname);

  return (
    <div className="flex items-center justify-center gap-2 mb-8">
      {steps.map((step, i) => {
        const isDone = i < currentIndex;
        const isActive = i === currentIndex;

        return (
          <div key={step.label} className="flex items-center gap-2">
            <div className="flex flex-col items-center gap-1">
              <div className={`step-badge ${
                isDone
                  ? 'bg-eco-green text-white'
                  : isActive
                  ? 'bg-eco-dark text-white ring-4 ring-eco-pale'
                  : 'bg-gray-200 text-gray-400'
              }`}>
                {isDone ? '✓' : i + 1}
              </div>
              <span className={`text-xs font-medium ${
                isActive ? 'text-eco-dark' : isDone ? 'text-eco-green' : 'text-gray-400'
              }`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`h-0.5 w-12 mb-4 ${i < currentIndex ? 'bg-eco-green' : 'bg-gray-200'}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
