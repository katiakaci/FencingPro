import React, { createContext, useContext, useState } from 'react';

const LightColorContext = createContext();

export const LightColorProvider = ({ children }) => {
    const [lightColor, setLightColor] = useState('lime'); // couleur par défaut

    return (
        <LightColorContext.Provider value={{ lightColor, setLightColor }}>
            {children}
        </LightColorContext.Provider>
    );
};

export const useLightColor = () => useContext(LightColorContext);
