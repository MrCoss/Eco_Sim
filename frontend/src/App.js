import React, { useState, useCallback, useEffect, useMemo } from 'react';

// --- SVG Icon Components ---
const LeafIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2">
        <path d="M11 20A7 7 0 0 1 4 13V8a7.999 7.999 0 0 1 1.25-4.25" />
        <path d="M11 20a2 2 0 0 0 2 0v-7a2 2 0 0 0-2-2h-1" />
        <path d="M11 20a9 9 0 0 1-7.25-4.75" />
        <path d="M13 20a9 9 0 0 0 7.25-4.75" />
        <path d="M13 20V8a7.999 7.999 0 0 0-1.25-4.25" />
        <path d="M13 13h1a2 2 0 0 0 2-2v-1" />
    </svg>
);

const ChevronDown = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 transition-transform duration-300">
        <path d="m6 9 6 6 6-6" />
    </svg>
);


// --- UI Components ---
const ThemeToggle = ({ theme, setTheme }) => (
    <button
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
        className="absolute top-6 right-6 p-2 rounded-full bg-gray-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 transition-colors z-50 hover:bg-gray-300 dark:hover:bg-slate-600"
        aria-label="Toggle theme"
    >
        {theme === 'light' ? '🌙' : '☀️'}
    </button>
);

const EcoSimLogo = () => (
    <div className="flex items-center justify-center text-green-600 dark:text-green-400">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <path d="M17.61 3.47C16.46 2.55 15.01 2 13.5 2c-2.8 0-5.29 1.51-6.7 3.74C4.67 6.29 3 8.61 3 11.25c0 3.31 2.69 6 6 6h8c2.76 0 5-2.24 5-5 0-2.43-1.72-4.44-4-4.89-.25-1.29-1.04-2.4-2.39-3.14zM17 15H9c-2.21 0-4-1.79-4-4 0-1.85 1.25-3.41 3-3.86.2-.05.39-.14.58-.26C9.99 5.8 11.62 5 13.5 5c.95 0 1.82.31 2.54.85.64.48 1.13 1.14 1.46 1.91l.23.53h.77c1.65 0 3 1.35 3 3s-1.35 3-3 3z"/>
        </svg>
        <span className="text-4xl font-bold ml-2 text-slate-800 dark:text-slate-100">EcoSim</span>
    </div>
);

const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <title>Loading</title>
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

const FeatureInput = React.memo(({ label, name, value, onChange, helpText }) => (
    <div className="relative">
        <label htmlFor={name} className="absolute -top-2 left-2 inline-block bg-white dark:bg-slate-800 px-1 text-xs font-medium text-slate-500 dark:text-slate-400">
            {label}
        </label>
        <input
            type="number"
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            className="block w-full rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent py-2.5 px-3 text-slate-800 dark:text-slate-200 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm transition duration-150 ease-in-out"
        />
        {helpText && <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">{helpText}</p>}
    </div>
));

const PredictionCard = ({ prediction, isLoading }) => {
    const coverTypeDetails = useMemo(() => ({
        'Spruce/Fir': { icon: '🌲', classification: { Genus: 'Picea, Abies' }, summary: 'Common in cold, high-elevation subalpine forests. These evergreen conifers are crucial for watershed protection and provide critical habitat for species like the lynx, marten, and various bird species.', imageUrl: '/images/spruce-fir.jpg', youtubeUrl: 'https://youtu.be/TLZ2BhcdLt0?si=UH9I1_MXF54Blul0' },
        'Lodgepole Pine': { icon: '🌲', classification: { Genus: 'Pinus' }, summary: 'A resilient pioneer species that thrives in the aftermath of forest fires, which heat its cones to release seeds. It is a vital source of timber and provides essential habitat and food for elk and deer.', imageUrl: '/images/lodgepole-pine.jpg', youtubeUrl: 'https://youtu.be/4llhmaLvKXA?si=JKPwIcB3hZBbFrGM' },
        'Ponderosa Pine': { icon: '🌲', classification: { Genus: 'Pinus' }, summary: 'Identifiable by its tall, straight trunk and distinctive cinnamon-colored bark that often smells like vanilla or butterscotch. It dominates drier, sunnier mountain slopes and is adapted to frequent, low-intensity fires.', imageUrl: '/images/ponderosa-pine.jpg', youtubeUrl: 'https://youtu.be/tjMt2EV9wNU?si=V7_3qlj1FcpY53gk' },
        'Cottonwood/Willow': { icon: '🌳', classification: { Genus: 'Populus, Salix' }, summary: 'Found in riparian zones along rivers and streams. These deciduous trees are essential for maintaining bank stability, preventing erosion, and supporting a high diversity of bird and insect species.', imageUrl: '/images/cottonwood-willow.jpg', youtubeUrl: 'https://youtu.be/buJ1wm73OIw?si=dlwHlyv14adqJLx6' },
        'Aspen': { icon: '🌳', classification: { Genus: 'Populus' }, summary: 'Famous for their stunning golden fall foliage and smooth, white bark. Aspen groves are often single, massive organisms connected by a shared root system, making them one of the largest living things on Earth.', imageUrl: '/images/aspen.jpg', youtubeUrl: 'https://youtu.be/JYVixAMIIxI?si=bteVIWq30Kj1wbsT' },
        'Douglas-fir': { icon: '🌲', classification: { Genus: 'Pseudotsuga' }, summary: 'A cornerstone species of Pacific Northwest forests. Despite its name, it is not a true fir. Its unique cones have distinctive three-pointed bracts that stick out from the scales, resembling the back half of a mouse.', imageUrl: '/images/douglas-fir.jpg', youtubeUrl: 'https://youtu.be/oOhMd2B_inw?si=IVqHNYpV-ae-Te_5' },
        'Krummholz': { icon: '🌳', classification: { Genus: 'N/A' }, summary: 'A German word for "crooked wood," this term describes the stunted, gnarled trees that grow at the harsh, windy treeline of high mountains. Their twisted forms are a testament to their struggle for survival in extreme conditions.', imageUrl: '/images/krummholz.jpg', youtubeUrl: 'https://youtu.be/eePaiGZRqTg?si=ahpMg-c-3yXZQyk9' },
        'Default': { icon: '❓', classification: { Genus: '?' }, summary: 'Input the cartographic variables on the right to predict the most likely forest cover type for that area.', imageUrl: '/images/default-forest.jpg' }
    }), []);
    const details = coverTypeDetails[prediction] || coverTypeDetails['Default'];

    return (
        <div className={`relative bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 h-full flex flex-col justify-between overflow-hidden transition-all duration-300 ${isLoading ? 'animate-pulse' : ''}`}>
            <div className="p-8">
                <div className="text-center">
                    <p className="text-slate-500 dark:text-slate-400 text-base">Predicted Forest Cover Type</p>
                    <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700 mt-2 tracking-wide min-h-[48px]">
                        {prediction || '...'}
                    </p>
                </div>
                <div className="text-left text-sm mt-4 text-slate-600 dark:text-slate-300 space-y-2">
                    <p><strong>Genus:</strong> {details.classification.Genus}</p>
                    <p className="pt-2">{details.summary}</p>
                </div>
                <div className="text-center mt-6">
                    {details.youtubeUrl && (
                         <a href={details.youtubeUrl} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center px-5 py-2 text-sm font-medium text-red-600 dark:text-red-300 bg-red-100 dark:bg-red-900/50 border border-red-200 dark:border-red-700 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors">
                             Watch Video
                         </a>
                    )}
                </div>
            </div>
        </div>
    );
};

const AboutSection = () => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 mt-12">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex justify-between items-center p-6 text-left text-xl font-bold text-slate-700 dark:text-slate-200"
            >
                <span>About This Project</span>
                <ChevronDown />
            </button>
            {isOpen && (
                <div className="px-6 pb-6 text-slate-600 dark:text-slate-300 space-y-4">
                    <p>
                        EcoSim is an AI-powered web application designed to predict forest cover types based on cartographic variables. It utilizes a pre-trained XGBoost model to analyze geographic data and provide insights into the distribution of different tree species.
                    </p>
                    <p>
                        The model was trained on the <a href="https://archive.ics.uci.edu/ml/datasets/Covertype" target="_blank" rel="noopener noreferrer" className="text-green-600 dark:text-green-400 hover:underline">Covertype Data Set</a> from the UCI Machine Learning Repository, which includes data from four wilderness areas located in the Roosevelt National Forest of northern Colorado.
                    </p>
                </div>
            )}
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

const wildernessAreas = {
    '1': 'Rawah Wilderness Area',
    '2': 'Neota Wilderness Area',
    '3': 'Comanche Peak Wilderness Area',
    '4': 'Cache la Poudre Wilderness Area',
};

const soilTypes = {
    '10': 'Leighcan family, till substratum',
    '29': 'Como - Legault families complex',
    // Add other relevant soil types for the dropdown
};

const getInitialState = () => {
    const initialState = formFeatures.reduce((acc, f) => ({ ...acc, [f.name]: f.defaultValue }), {});
    initialState['Wilderness_Area'] = '1';
    initialState['Soil_Type'] = '10';
    return initialState;
};

// --- Main App Component ---
export default function App() {
    const [formData, setFormData] = useState(getInitialState);
    const [prediction, setPrediction] = useState(null);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [theme, setTheme] = useState('light');

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const numericFormData = Object.fromEntries(
                Object.entries(formData).map(([key, value]) => {
                    if (key !== 'Wilderness_Area' && key !== 'Soil_Type') {
                        return [key, Number(value)];
                    }
                    return [key, value];
                })
            );

            const payload = { ...numericFormData };
            
            // One-hot encode Wilderness Area
            for (let i = 1; i <= 4; i++) {
                payload[`Wilderness_Area_${i}`] = (payload.Wilderness_Area === String(i)) ? 1 : 0;
            }
            delete payload.Wilderness_Area;

            // One-hot encode Soil Type
            for (let i = 1; i <= 40; i++) {
                payload[`Soil_Type_${i}`] = (payload.Soil_Type === String(i)) ? 1 : 0;
            }
            delete payload.Soil_Type;

            const baseUrl = process.env.REACT_APP_API_URL || 'http://localhost:8000';
            const response = await fetch(`${baseUrl}/predict`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setPrediction(data.prediction);

        } catch (err) {
            console.error("API Error:", err);
            setError(err.message || 'Failed to connect to the prediction server. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen font-sans antialiased bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 transition-colors">
            <ThemeToggle theme={theme} setTheme={setTheme} />
            <div className="relative z-10 p-4 sm:p-6 lg:p-8">
                <div className="max-w-7xl mx-auto">
                    
                    <header className="text-center py-12">
                        <EcoSimLogo />
                        <p className="mt-4 max-w-2xl mx-auto text-lg text-slate-600 dark:text-slate-400">
                            Peer into the future of our forests. Our AI analyzes geographic data to reveal the hidden patterns of the wild.
                        </p>
                    </header>
                    
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12 items-start">
                        {/* Left Column */}
                        <div className="lg:col-span-2">
                            <PredictionCard 
                                prediction={prediction}
                                isLoading={isLoading}
                            />
                        </div>

                        {/* Right Column */}
                        <div className="lg:col-span-3">
                            <main className="bg-white dark:bg-slate-800 p-8 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 w-full">
                                <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-6">Input Parameters</h2>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {/* Quick Selection Dropdowns */}
                                        <div>
                                            <label htmlFor="Wilderness_Area" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Wilderness Area</label>
                                            <select
                                                id="Wilderness_Area"
                                                name="Wilderness_Area"
                                                value={formData.Wilderness_Area}
                                                onChange={handleChange}
                                                className="block w-full rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent py-2.5 px-3 text-slate-800 dark:text-slate-200 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm transition"
                                            >
                                                {Object.entries(wildernessAreas).map(([key, name]) => (
                                                    <option key={key} value={key}>{name}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div>
                                            <label htmlFor="Soil_Type" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Soil Type</label>
                                            <select
                                                id="Soil_Type"
                                                name="Soil_Type"
                                                value={formData.Soil_Type}
                                                onChange={handleChange}
                                                className="block w-full rounded-md border-2 border-slate-300 dark:border-slate-600 bg-transparent py-2.5 px-3 text-slate-800 dark:text-slate-200 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm transition"
                                            >
                                                {Object.entries(soilTypes).map(([key, description]) => (
                                                    <option key={key} value={key}>{description}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                        {formFeatures.map((feature) => (
                                            <FeatureInput
                                                key={feature.name}
                                                {...feature}
                                                value={formData[feature.name]}
                                                onChange={handleChange}
                                            />
                                        ))}
                                    </div>
                                    
                                    <div className="pt-4 text-center">
                                        <button
                                            type="submit"
                                            disabled={isLoading}
                                            className="w-full sm:w-auto inline-flex items-center justify-center px-10 py-3 font-semibold text-white transition-all duration-300 ease-out bg-green-600 border-2 border-transparent rounded-lg shadow-md group disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 active:scale-95"
                                        >
                                            {isLoading ? <LoadingSpinner /> : 'Predict Cover Type'}
                                        </button>
                                        {error && <p className="text-red-500 font-medium text-center mt-4 text-sm">{error}</p>}
                                    </div>
                                </form>
                            </main>
                        </div>
                    </div>
                    
                    <AboutSection />
                </div>
            </div>
        </div>
    );
}
