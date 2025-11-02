import React, { useState, useEffect } from 'react';

interface SpinningWheelProps {
  users: string[];
  isSpinning: boolean;
  targetUser: string | null;
  onSpinEnd: () => void;
}

const WHEEL_COLORS = [
  '#ef4444', '#3b82f6', '#22c55e', '#eab308',
  '#8b5cf6', '#ec4899', '#14b8a6', '#f97316'
];

const SpinningWheel: React.FC<SpinningWheelProps> = ({ users, isSpinning, targetUser, onSpinEnd }) => {
  const [rotation, setRotation] = useState(0);
  const [spinFinished, setSpinFinished] = useState(false);

  useEffect(() => {
    if (isSpinning && targetUser) {
      setSpinFinished(false); // Reset on new spin

      const targetIndex = users.indexOf(targetUser);
      if (targetIndex === -1) return;

      const fullRotations = 5;
      const degreesPerSegment = 360 / users.length;
      const targetSegmentMiddle = degreesPerSegment * (targetIndex + 0.5);
      const randomOffset = (Math.random() - 0.5) * degreesPerSegment * 0.8; // Add some randomness within the segment

      const finalRotation = (360 * fullRotations) - targetSegmentMiddle - randomOffset;
      
      setRotation(prev => {
        // Find the closest equivalent angle to start from to make the spin look natural
        const currentAngle = prev % 360;
        const revolutions = Math.floor(prev / 360);
        return (revolutions * 360) + currentAngle + finalRotation;
      });

      setTimeout(() => {
        onSpinEnd();
        setSpinFinished(true);
      }, 4000);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSpinning, targetUser]);

  const segmentAngle = 360 / users.length;
  const conicGradient = users.map((_, i) => 
    `${WHEEL_COLORS[i % WHEEL_COLORS.length]} ${i * segmentAngle}deg ${(i + 1) * segmentAngle}deg`
  ).join(', ');

  return (
    <div className="relative w-72 h-72 md:w-96 md:h-96 mx-auto my-8 flex items-center justify-center">
      {/* Pointer */}
      <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20" style={{ filter: 'drop-shadow(0 2px 2px rgba(0,0,0,0.5))' }}>
        <div className="w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[20px] border-t-white"></div>
      </div>
      
      {/* Wheel container */}
      <div 
        className="relative w-full h-full rounded-full border-8 border-slate-500 shadow-2xl transition-transform duration-[4000ms] ease-out"
        style={{
          transform: `rotate(${rotation}deg)`,
          background: users.length > 0 ? `conic-gradient(${conicGradient})` : '#64748b'
        }}
      >
        {/* User names */}
        {users.map((user, i) => {
          const angle = segmentAngle * i + segmentAngle / 2;
          const isWinner = spinFinished && !isSpinning && targetUser === user;

          return (
            <div 
              key={user}
              className="absolute top-0 left-0 w-full h-full"
              style={{ transform: `rotate(${angle}deg)` }}
            >
              <div 
                className="absolute top-4 left-1/2 -translate-x-1/2 text-white font-bold text-sm md:text-base break-all transition-all duration-300 ease-in-out"
                style={{ 
                  transform: `rotate(${-angle}deg) ${isWinner ? 'scale(1.2)' : 'scale(1)'}`,
                  filter: isWinner ? 'drop-shadow(0 0 6px rgba(255, 255, 255, 1))' : 'none',
                 }}
              >
                {user.split(' ')[0]} 
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SpinningWheel;