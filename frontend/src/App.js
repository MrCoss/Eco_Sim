import React, { useState, useCallback, useEffect, useMemo } from 'react';

// --- Helper & Hook Imports ---
const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
            console.error(error);
            return initialValue;
        }
    });

    const setValue = (value) => {
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
            console.error(error);
        }
    };
    return [storedValue, setValue];
};

// --- UI Component Imports ---
const FallingLeaves = React.memo(() => (
    <div className="falling-leaves fixed top-0 left-0 w-full h-full pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
            <div key={i} className="leaf" style={{
                left: `${Math.random() * 100}vw`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${5 + Math.random() * 10}s`
            }}></div>
        ))}
    </div>
));

const ThemeToggle = ({ theme, setTheme }) => (
    <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 transition-colors z-50"
        aria-label="Toggle theme"
    >
        {theme === 'light' ? '🌙' : '☀️'}
    </button>
);

const EcoSimLogo = () => (
    <div className="w-80 h-80 mx-auto">
        <img src="/logo.png" alt="EcoSim Logo" className="w-full h-full object-contain" />
    </div>
);

const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <title>Loading</title>
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const FeatureInput = React.memo(({ label, name, value, onChange, helpText, delay }) => (
    <div className="relative animate-fade-in-up" style={{ animationDelay: `${delay * 50}ms`}}>
        <label htmlFor={name} className="absolute -top-2 left-2 inline-block bg-gray-50 dark:bg-gray-800 px-1 text-xs font-medium text-gray-500 dark:text-gray-400">
            {label}
        </label>
        <input
            type="number"
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            className="block w-full rounded-md border-2 border-gray-300 dark:border-gray-600 bg-transparent py-2.5 px-3 text-gray-800 dark:text-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm transition duration-150 ease-in-out"
        />
        {helpText && <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">{helpText}</p>}
    </div>
));

const PredictionCard = ({ prediction, isLoading, onShowMap, mapVisible, mapDataLoaded }) => {
    const coverTypeDetails = useMemo(() => ({
        'Spruce/Fir': { icon: '🌲', classification: { Genus: 'Picea, Abies' }, summary: 'Common in cold, high-elevation subalpine forests.', imageUrl: '/images/spruce-fir.jpg', youtubeUrl: 'https://youtu.be/TLZ2BhcdLt0?si=UH9I1_MXF54Blul0' },
        'Lodgepole Pine': { icon: '🌲', classification: { Genus: 'Pinus' }, summary: 'A pioneer species that thrives after forest fires.', imageUrl: '/images/lodgepole-pine.jpg', youtubeUrl: 'https://youtu.be/4llhmaLvKXA?si=JKPwIcB3hZBbFrGM' },
        'Ponderosa Pine': { icon: '🌲', classification: { Genus: 'Pinus' }, summary: 'Identifiable by its tall, straight trunk and cinnamon-colored bark.', imageUrl: '/images/ponderosa-pine.jpg', youtubeUrl: 'https://youtu.be/tjMt2EV9wNU?si=V7_3qlj1FcpY53gk' },
        'Cottonwood/Willow': { icon: '🌳', classification: { Genus: 'Populus, Salix' }, summary: 'Found in riparian zones along rivers and streams.', imageUrl: '/images/cottonwood-willow.jpg', youtubeUrl: 'https://youtu.be/buJ1wm73OIw?si=dlwHlyv14adqJLx6' },
        'Aspen': { icon: '🌳', classification: { Genus: 'Populus' }, summary: 'Known for their stunning golden fall foliage.', imageUrl: '/images/aspen.jpg', youtubeUrl: 'https://youtu.be/JYVixAMIIxI?si=bteVIWq30Kj1wbsT' },
        'Douglas-fir': { icon: '🌲', classification: { Genus: 'Pseudotsuga' }, summary: 'A key species in the Pacific Northwest, not a true fir.', imageUrl: '/images/douglas-fir.jpg', youtubeUrl: 'https://youtu.be/oOhMd2B_inw?si=IVqHNYpV-ae-Te_5' },
        'Krummholz': { icon: '🌳', classification: { Genus: 'N/A' }, summary: 'Stunted, gnarled trees growing at the harsh treeline.', imageUrl: '/images/krummholz.jpg', youtubeUrl: 'https://youtu.be/eePaiGZRqTg?si=ahpMg-c-3yXZQyk9' },
        'Default': { icon: '❓', classification: { Genus: '?' }, summary: 'Input variables to predict the forest cover type.', imageUrl: '/images/default-forest.jpg' }
    }), []);
    const details = coverTypeDetails[prediction] || coverTypeDetails['Default'];

    return (
        <div className={`relative bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 h-full flex flex-col justify-between overflow-hidden ${isLoading ? 'animate-shimmer' : ''}`}>
            <div className="p-8">
                <div className="text-center">
                    <p className="text-gray-500 dark:text-gray-400 text-base">Predicted Forest Cover Type</p>
                    <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700 mt-2 tracking-wide min-h-[48px]">
                        {prediction || '...'}
                    </p>
                </div>
                <div className="text-left text-sm mt-4 text-gray-600 dark:text-gray-300 space-y-2">
                    <p><strong>Genus:</strong> {details.classification.Genus}</p>
                    <p className="pt-2">{details.summary}</p>
                </div>
                <div className="text-center mt-6 space-x-4">
                    {prediction && mapDataLoaded && (
                        <button onClick={onShowMap} className="px-5 py-2 text-sm font-medium text-blue-600 dark:text-blue-300 bg-blue-100 dark:bg-blue-900/50 border border-blue-200 dark:border-blue-700 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900 transition-colors">
                            {mapVisible ? 'Hide' : 'Show'} Interactive Map
                        </button>
                    )}
                    {details.youtubeUrl && (
                         <a href={details.youtubeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-5 py-2 text-sm font-medium text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-lg hover:bg-red-200 dark:hover:bg-red-900 transition-colors">
                             Watch Video
                         </a>
                    )}
                </div>
            </div>
            <div className="w-full h-48 bg-gray-100 dark:bg-gray-900 bg-cover bg-center" style={{backgroundImage: `url(${details.imageUrl})`}}></div>
        </div>
    );
};

// --- Data & API Configuration ---
const formFeatures = [
    { name: 'Elevation', label: 'Elevation', helpText: 'in meters', defaultValue: '2596' },
    { name: 'Aspect', label: 'Aspect', helpText: 'in degrees', defaultValue: '51' },
    { name: 'Slope', label: 'Slope', helpText: 'in degrees', defaultValue: '3' },
    { name: 'Horizontal_Distance_To_Hydrology', label: 'Horiz. Dist. to Water', helpText: 'in meters', defaultValue: '258' },
    { name: 'Vertical_Distance_To_Hydrology', label: 'Vert. Dist. to Water', helpText: 'in meters', defaultValue: '0' },
    { name: 'Horizontal_Distance_To_Roadways', label: 'Horiz. Dist. to Roads', helpText: 'in meters', defaultValue: '510' },
    { name: 'Hillshade_9am', label: 'Hillshade (9am)', helpText: '0-255', defaultValue: '221' },
    { name: 'Hillshade_Noon', label: 'Hillshade (Noon)', helpText: '0-255', defaultValue: '232' },
    { name: 'Hillshade_3pm', label: 'Hillshade (3pm)', helpText: '0-255', defaultValue: '148' },
    { name: 'Horizontal_Distance_To_Fire_Points', label: 'Horiz. Dist. to Fire', helpText: 'in meters', defaultValue: '6279' },
];

const soilTypes = {
    'Soil_Type10': 'Leighcan family, till substratum...',
    'Soil_Type29': 'Como - Legault families complex...',
    // Add other soil types as needed
};

const getInitialState = () => {
    const initialState = formFeatures.reduce((acc, f) => ({ ...acc, [f.name]: f.defaultValue }), {});
    initialState['Soil_Type'] = 'Soil_Type10';
    return initialState;
};

// --- Main App Component ---
export default function App() {
    const [formData, setFormData] = useState(getInitialState);
    const [prediction, setPrediction] = useState(null);
    const [probabilities, setProbabilities] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mapData, setMapData] = useState([]);
    const [showMap, setShowMap] = useState(false);
    const [predictionHistory, setPredictionHistory] = useLocalStorage('ecosim_history', []);
    const [theme, setTheme] = useLocalStorage('ecosim_theme', 'light');

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    useEffect(() => {
        const fetchMapData = async () => {
            try {
                const response = await fetch(`${process.env.PUBLIC_URL}/train_clean.csv`);
                const text = await response.text();
                const rows = text.split('\n').slice(1);
                const data = rows.map(row => {
                    const values = row.split(',');
                    return {
                        Horizontal_Distance_To_Roadways: +values[4],
                        Horizontal_Distance_To_Hydrology: +values[5],
                        Cover_Type: +values[11]
                    };
                }).filter(d => !isNaN(d.Cover_Type));
                
                const sample = data.filter((_, i) => i % Math.floor(data.length / 2000) === 0);
                setMapData(sample);
            } catch (err) {
                console.error("Failed to load map data:", err);
            }
        };
        fetchMapData();
    }, []);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            // --- FIX: Convert all form values to numbers before sending ---
            const numericFormData = Object.fromEntries(
                Object.entries(formData).map(([key, value]) => {
                    if (key !== 'Soil_Type') {
                        return [key, Number(value)];
                    }
                    return [key, value];
                })
            );

            const payload = { ...numericFormData };
            Object.keys(soilTypes).forEach(key => {
                payload[key] = (payload.Soil_Type === key) ? 1 : 0;
            });
            delete payload.Soil_Type;

            const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
            const response = await fetch(`${baseUrl}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setPrediction(data.prediction);
            setProbabilities(data.probabilities);
            setPredictionHistory(prev => [data.prediction, ...prev]);

        } catch (err) {
            console.error("API Error:", err);
            setError('Failed to connect to the prediction server. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen text-gray-800 dark:text-gray-200 antialiased font-inter bg-gray-50 dark:bg-gray-900 transition-colors">
            <FallingLeaves />
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <div className="relative z-10 p-4 lg:p-8">
                <div className="w-full max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left Column */}
                        <div className="flex flex-col justify-center animate-fade-in-up">
                            <div className="text-center lg:text-left">
                               <EcoSimLogo />
                                <p className="text-lg text-gray-500 dark:text-gray-400 mt-3 max-w-md mx-auto lg:mx-0">
                                    Peer into the future of our forests. Our AI analyzes geographic data to reveal the hidden patterns of the wild.
                                </p>
                            </div>
                            <div className="mt-8">
                                <PredictionCard 
                                    prediction={prediction}
                                    isLoading={isLoading}
                                    onShowMap={() => setShowMap(!showMap)}
                                    mapVisible={showMap}
                                    mapDataLoaded={mapData.length > 0}
                                />
                            </div>
                        </div>

                        {/* Right Column */}
                        <div className="flex flex-col justify-center">
                            <main className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 w-full">
                                <h2 className="text-2xl font-bold font-manrope text-gray-700 dark:text-gray-200 mb-6">Input Parameters</h2>
                                <form onSubmit={handleSubmit}>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {formFeatures.map((feature, index) => (
                                            <FeatureInput
                                                key={feature.name}
                                                {...feature}
                                                value={formData[feature.name]}
                                                onChange={handleChange}
                                                delay={index}
                                            />
                                        ))}
                                        <div className="relative animate-fade-in-up sm:col-span-2" style={{ animationDelay: `${formFeatures.length * 50}ms`}}>
                                            <label htmlFor="Soil_Type" className="absolute -top-2 left-2 inline-block bg-white dark:bg-gray-800 px-1 text-xs font-medium text-gray-500 dark:text-gray-400">Soil Type</label>
                                            <select
                                                id="Soil_Type"
                                                name="Soil_Type"
                                                value={formData.Soil_Type}
                                                onChange={handleChange}
                                                className="appearance-none block w-full rounded-md border-2 border-gray-300 dark:border-gray-600 bg-transparent py-2.5 px-3 text-gray-800 dark:text-gray-200 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm transition"
                                            >
                                                {Object.entries(soilTypes).map(([key, description]) => (
                                                    <option key={key} value={key}>{description}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    <div className="mt-8 text-center">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="relative w-full sm:w-auto inline-flex items-center justify-center px-10 py-3 font-medium text-white transition-all duration-300 ease-out bg-green-600 border-2 border-green-600 rounded-lg shadow-md group disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 hover:border-green-700 active:scale-95"
                                        >
                                            {isLoading ? <LoadingSpinner /> : 'Predict Cover Type'}
                                        </button>
                                        {error && <p className="text-red-500 font-medium text-center mt-4 text-sm">{error}</p>}
                                    </div>
                                </form>
                            </main>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
