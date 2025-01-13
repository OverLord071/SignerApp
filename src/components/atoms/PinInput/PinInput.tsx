import React, {FC, useState} from 'react';
import "./PinInput.scss";

interface PinInputProps {
    onPinChange: (pin: string) => void;
    disabled?: boolean;
}

const PinInput: FC<PinInputProps> = ({onPinChange, disabled = false}) => {
    const [pins, setPins] = useState<string[]>(Array(6).fill(""));

    const handleChange = (value: string, index: number) => {
      if (!/^\d*$/.test(value)) return;
      const newPins = [...pins];
      newPins[index] = value.slice(-1);
      setPins(newPins);
      onPinChange(newPins.join(''));

      if (value && index < 5) {
          const nextInput = document.getElementById(`pin-${index + 1}`);
          if (nextInput) (nextInput as HTMLInputElement).focus();
      }
    };

    const handleKeyDown = (event: React.KeyboardEvent, index: number) => {
        if (event.key === 'Backspace' && !pins[index] && index > 0) {
            const prevInput = document.getElementById(`pin-${index - 1}`);
            if (prevInput) (prevInput as HTMLInputElement).focus();
        }
    };


    return (
        <div className="pin-input-container">
            {pins.map((pin, index) => (
                <input
                    key={index}
                    id={`pin-${index}`}
                    type="text"
                    value={pin}
                    maxLength={1}
                    disabled={disabled}
                    className={`pin-input ${disabled ? 'pin-input--disabled' : ''}`}
                    onChange={(e) => handleChange(e.target.value, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                />
            ))}
        </div>
    );
};

export default PinInput;