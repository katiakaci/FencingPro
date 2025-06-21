import React, { createContext, useContext, useState } from 'react';

const TouchContext = createContext();

export const TouchProvider = ({ children }) => {
    const [touchDetected, setTouchDetected] = useState(false);

    return (
        <TouchContext.Provider value={{ touchDetected, setTouchDetected }}>
            {children}
        </TouchContext.Provider>
    );
};

export const useTouch = () => useContext(TouchContext);
