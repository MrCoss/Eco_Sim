import React, { useState, useCallback, useEffect, useMemo } from 'react';

// --- Custom Logo Component ---
const EcoSimLogo = () => (
    <div className="w-80 h-80 mx-auto">
        <img src="/logo.png" alt="EcoSim Logo" className="w-full h-full object-contain" />
    </div>
);

// --- Loading Spinner Component ---
const LoadingSpinner = () => (
    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <title>Loading</title>
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
);

// --- Reusable Input Component ---
const FeatureInput = ({ label, name, value, onChange, helpText, delay }) => (
    <div className="relative animate-fade-in-up" style={{ animationDelay: `${delay * 50}ms`}}>
        <label htmlFor={name} className="absolute -top-2 left-2 inline-block bg-gray-50 px-1 text-xs font-medium text-gray-500">
            {label}
        </label>
        <input
            type="number"
            name={name}
            id={name}
            value={value}
            onChange={onChange}
            className="block w-full rounded-md border-2 border-gray-300 bg-transparent py-2.5 px-3 text-gray-800 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm transition duration-150 ease-in-out"
        />
        {helpText && <p className="mt-1 text-xs text-gray-400">{helpText}</p>}
    </div>
);

// --- Enhanced Prediction Result Card ---
const PredictionCard = ({ prediction, isLoading, onShowMap, mapVisible, mapDataLoaded }) => {
    const coverTypeDetails = {
        'Spruce/Fir': {
            icon: '🌲',
            classification: { Kingdom: 'Plantae', Division: 'Pinophyta', Class: 'Pinopsida', Family: 'Pinaceae', Genus: 'Picea, Abies' },
            summary: 'Common in cold, high-elevation subalpine forests. These trees are crucial for watershed protection and provide habitat for species like the lynx and marten.',
            imageUrl: '/images/spruce-fir.jpg',
            youtubeUrl: 'https://youtu.be/TLZ2BhcdLt0?si=UH9I1_MXF54Blul0'
        },
        'Lodgepole Pine': {
            icon: '🌲',
            classification: { Kingdom: 'Plantae', Division: 'Pinophyta', Class: 'Pinopsida', Family: 'Pinaceae', Genus: 'Pinus' },
            summary: 'A pioneer species that thrives after forest fires, which open its cones. It\'s a vital source of timber and habitat for elk and deer.',
            imageUrl: '/images/lodgepole-pine.jpg',
            youtubeUrl: 'https://youtu.be/4llhmaLvKXA?si=JKPwIcB3hZBbFrGM'
        },
        'Ponderosa Pine': {
            icon: '🌲',
            classification: { Kingdom: 'Plantae', Division: 'Pinophyta', Class: 'Pinopsida', Family: 'Pinaceae', Genus: 'Pinus' },
            summary: 'Identifiable by its tall, straight trunk and cinnamon-colored bark that smells like vanilla. It dominates drier, sunnier mountain slopes.',
            imageUrl: '/images/ponderosa-pine.jpg',
            youtubeUrl: 'https://youtu.be/tjMt2EV9wNU?si=V7_3qlj1FcpY53gk'
        },
        'Cottonwood/Willow': {
            icon: '🌳',
            classification: { Kingdom: 'Plantae', Division: 'Tracheophyta', Class: 'Magnoliopsida', Family: 'Salicaceae', Genus: 'Populus, Salix' },
            summary: 'Found in riparian zones along rivers and streams. These trees are essential for bank stability and support a high diversity of bird species.',
            imageUrl: '/images/cottonwood-willow.jpg',
            youtubeUrl: 'https://youtu.be/buJ1wm73OIw?si=dlwHlyv14adqJLx6'
        },
        'Aspen': {
            icon: '🌳',
            classification: { Kingdom: 'Plantae', Division: 'Tracheophyta', Class: 'Magnoliopsida', Family: 'Salicaceae', Genus: 'Populus' },
            summary: 'Known for their stunning golden fall foliage and smooth, white bark. Aspen groves are often single, massive organisms connected by their roots.',
            imageUrl: '/images/aspen.jpg',
            youtubeUrl: 'https://youtu.be/JYVixAMIIxI?si=bteVIWq30Kj1wbsT'
        },
        'Douglas-fir': {
            icon: '🌲',
            classification: { Kingdom: 'Plantae', Division: 'Pinophyta', Class: 'Pinopsida', Family: 'Pinaceae', Genus: 'Pseudotsuga' },
            summary: 'A key species in the Pacific Northwest, it\'s not a true fir. Its unique cones have distinctive three-pointed bracts that stick out from the scales.',
            imageUrl: '/images/douglas-fir.jpg',
            youtubeUrl: 'https://youtu.be/oOhMd2B_inw?si=IVqHNYpV-ae-Te_5'
        },
        'Krummholz': {
            icon: '🌳',
            classification: { Kingdom: 'Plantae', Division: 'N/A', Class: 'N/A', Family: 'Various', Genus: 'N/A' },
            summary: 'A German word for "crooked wood," this describes the stunted, gnarled trees that grow at the harsh, windy treeline of high mountains.',
            imageUrl: '/images/krummholz.jpg',
            youtubeUrl: 'https://youtu.be/eePaiGZRqTg?si=ahpMg-c-3yXZQyk9'
        },
        'Default': {
            icon: '❓',
            classification: { Kingdom: '?', Division: '?', Class: '?', Family: '?', Genus: '?' },
            summary: 'Input the cartographic variables on the right to predict the most likely forest cover type for that area.',
            imageUrl: '/images/default-forest.jpg'
        }
    };
    const details = coverTypeDetails[prediction] || coverTypeDetails['Default'];

    return (
        <div className={`relative bg-white rounded-xl shadow-lg border border-gray-200 h-full flex flex-col justify-between overflow-hidden ${isLoading ? 'animate-shimmer' : ''}`}>
             <div className="p-8">
                <div className="text-center">
                    <p className="text-gray-500 text-base">Predicted Forest Cover Type</p>
                    <p className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700 mt-2 tracking-wide min-h-[48px]">
                        {prediction || '...'}
                    </p>
                </div>
                <div className="text-left text-sm mt-4 text-gray-600 space-y-2">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {Object.entries(details.classification).map(([key, value]) => (
                            <div key={key}><strong>{key}:</strong> {value}</div>
                        ))}
                    </div>
                    <p className="pt-2">{details.summary}</p>
                </div>
                
                <div className="text-center mt-6 space-x-4">
                    {prediction && mapDataLoaded && (
                        <button
                            onClick={onShowMap}
                            className="px-5 py-2 text-sm font-medium text-blue-600 bg-blue-100 border border-blue-200 rounded-lg hover:bg-blue-200 transition-colors"
                        >
                            {mapVisible ? 'Hide' : 'Show'} Interactive Map
                        </button>
                    )}
                    {details.youtubeUrl && (
                         <a href={details.youtubeUrl} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center px-5 py-2 text-sm font-medium text-red-600 bg-red-100 border border-red-200 rounded-lg hover:bg-red-200 transition-colors"
                         >
                             Watch Video
                         </a>
                    )}
                </div>
             </div>
             <div className="w-full h-48 bg-gray-100 bg-contain bg-no-repeat bg-center" style={{backgroundImage: `url(${details.imageUrl})`}}></div>
        </div>
    );
};

// --- Interactive Map Component ---
const ForestMap = ({ data }) => {
    const [tooltip, setTooltip] = useState(null);
    const coverTypeInfo = {
        1: { name: 'Spruce/Fir', color: '#1E90FF' }, 2: { name: 'Lodgepole Pine', color: '#32CD32' },
        3: { name: 'Ponderosa Pine', color: '#FFD700' }, 4: { name: 'Cottonwood/Willow', color: '#FF69B4' },
        5: { name: 'Aspen', color: '#ADFF2F' }, 6: { name: 'Douglas-fir', color: '#8A2BE2' },
        7: { name: 'Krummholz', color: '#A52A2A' },
    };
    const { xScale, yScale, xMax, yMax } = useMemo(() => {
        if (data.length === 0) return { xScale: () => 0, yScale: () => 0, xMax: 0, yMax: 0 };
        const xValues = data.map(d => d.Horizontal_Distance_To_Roadways);
        const yValues = data.map(d => d.Horizontal_Distance_To_Hydrology);
        const xMax = Math.max(...xValues);
        const yMax = Math.max(...yValues);
        const xScale = (value) => (value / xMax) * 100;
        const yScale = (value) => 100 - (value / yMax) * 100;
        return { xScale, yScale, xMax, yMax };
    }, [data]);

    return (
        <div className="animate-fade-in-up">
            <h3 className="text-2xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700">Forest Cover Data Visualization</h3>
            <div className="relative w-full aspect-video bg-gray-100 rounded-lg p-4 border border-gray-200 overflow-hidden shadow-inner">
                <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
                    {data.map((d, i) => (
                        <circle key={i} cx={xScale(d.Horizontal_Distance_To_Roadways)} cy={yScale(d.Horizontal_Distance_To_Hydrology)} r="0.5" fill={coverTypeInfo[d.Cover_Type]?.color || '#333'} className="transition-transform duration-150 ease-in-out" onMouseEnter={(e) => { e.target.style.transform = 'scale(2.5)'; setTooltip({ data: d, x: e.clientX, y: e.clientY }); }} onMouseLeave={(e) => { e.target.style.transform = 'scale(1)'; setTooltip(null); }} />
                    ))}
                </svg>
                {tooltip && (
                    <div className="fixed bg-white border border-gray-300 rounded-lg p-3 text-xs text-gray-800 shadow-lg pointer-events-none z-50" style={{ left: tooltip.x + 15, top: tooltip.y + 15 }}>
                        <div className="font-bold text-base" style={{color: coverTypeInfo[tooltip.data.Cover_Type]?.color}}>{coverTypeInfo[tooltip.data.Cover_Type]?.name}</div>
                        <div>Elevation: {tooltip.data.Elevation}m</div>
                        <div>Slope: {tooltip.data.Slope}°</div>
                        <div>Aspect: {tooltip.data.Aspect}°</div>
                    </div>
                )}
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-2 px-1"><span>Horiz. Dist. to Roads (0-{xMax}m) &rarr;</span><span>&uarr; Horiz. Dist. to Water (0-{yMax}m)</span></div>
            <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-2">
                {Object.entries(coverTypeInfo).map(([key, { name, color }]) => (
                    <div key={key} className="flex items-center space-x-2 text-xs text-gray-700"><div className="w-3 h-3 rounded-full" style={{ backgroundColor: color }}></div><span>{name}</span></div>
                ))}
            </div>
        </div>
    );
};

// --- Prediction History Graph ---
const HistoryGraph = ({ history, onClear }) => {
    const coverTypes = useMemo(() => ['Spruce/Fir', 'Lodgepole Pine', 'Ponderosa Pine', 'Cottonwood/Willow', 'Aspen', 'Douglas-fir', 'Krummholz'], []);
    
    const counts = useMemo(() => {
        const countMap = new Map(coverTypes.map(type => [type, 0]));
        history.forEach(p => {
            if (countMap.has(p)) {
                countMap.set(p, countMap.get(p) + 1);
            }
        });
        return Array.from(countMap.values());
    }, [history, coverTypes]);

    const maxCount = Math.max(...counts, 1);

    return (
        <div className="animate-fade-in-up">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700">Prediction History</h3>
                <button onClick={onClear} className="px-3 py-1 text-xs font-medium text-red-600 bg-red-100 border border-red-200 rounded-md hover:bg-red-200">
                    Clear
                </button>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-4">
                {coverTypes.map((type, index) => {
                    const count = counts[index];
                    const percentage = (count / maxCount) * 100;
                    return (
                        <div key={type} className="flex items-center">
                            <span className="w-40 text-sm text-gray-600">{type}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-4">
                                <div 
                                    className="bg-green-500 h-4 rounded-full transition-all duration-500 ease-out flex items-center justify-end pr-2"
                                    style={{ width: `${percentage}%` }}
                                >
                                   {count > 0 && <span className="text-xs font-bold text-white">{count}</span>}
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Prediction Probability Chart ---
const ProbabilityChart = ({ probabilities }) => {
    if (!probabilities || probabilities.length === 0) return null;
    
    const sortedProbabilities = [...probabilities].sort((a, b) => b.probability - a.probability);
    
    return (
        <div className="animate-fade-in-up">
            <h3 className="text-2xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-green-500 to-green-700">Prediction Confidence</h3>
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 space-y-4">
                {sortedProbabilities.map(({ type, probability }) => {
                    const percentage = probability * 100;
                    return (
                        <div key={type} className="flex items-center">
                            <span className="w-40 text-sm text-gray-600">{type}</span>
                            <div className="flex-1 bg-gray-200 rounded-full h-5">
                                <div 
                                    className="bg-blue-500 h-5 rounded-full transition-all duration-500 ease-out flex items-center justify-center"
                                    style={{ width: `${percentage}%` }}
                                >
                                   <span className="text-xs font-bold text-white">{percentage.toFixed(1)}%</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Form Configuration ---
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
    'Soil_Type1': 'Cathedral family - Rock outcrop complex, extremely stony',
    'Soil_Type2': 'Vanet - Ratake families complex, very stony',
    'Soil_Type10': 'Leighcan family, till substratum, extremely bouldery',
    'Soil_Type22': 'Legault family - Rock land complex, stony',
    'Soil_Type23': 'Catamount family - Rock land - Bullwark family complex, rubbly',
    'Soil_Type29': 'Como - Legault families complex, extremely stony',
    'Soil_Type32': 'Bullwark - Catamount families - Rock outcrop complex, rubbly',
    'Soil_Type38': 'Moran family - Cryaquolls complex, local alluvium-slopewash',
};

const soilTypeShortLabels = {
    'Soil_Type1': 'Cathedral family - Rock outcrop...',
    'Soil_Type2': 'Vanet - Ratake families complex...',
    'Soil_Type10': 'Leighcan family, till substratum...',
    'Soil_Type22': 'Legault family - Rock land complex...',
    'Soil_Type23': 'Catamount family - Rock land...',
    'Soil_Type29': 'Como - Legault families complex...',
    'Soil_Type32': 'Bullwark - Catamount families...',
    'Soil_Type38': 'Moran family - Cryaquolls complex...',
};


const getInitialState = () => {
    const initialState = formFeatures.reduce((acc, f) => ({ ...acc, [f.name]: f.defaultValue }), {});
    initialState['Soil_Type'] = 'Soil_Type10'; // Default soil type
    return initialState;
};

export default function App() {
    const [formData, setFormData] = useState(getInitialState);
    const [prediction, setPrediction] = useState(null);
    const [probabilities, setProbabilities] = useState([]);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [mapData, setMapData] = useState([]);
    const [showMap, setShowMap] = useState(false);
    const [isScriptLoaded, setIsScriptLoaded] = useState(false);
    const [predictionHistory, setPredictionHistory] = useState([]);
    
    useEffect(() => {
        const storedHistory = localStorage.getItem('ecosim_history');
        if (storedHistory) {
            setPredictionHistory(JSON.parse(storedHistory));
        }
    }, []);

    useEffect(() => {
        localStorage.setItem('ecosim_history', JSON.stringify(predictionHistory));
    }, [predictionHistory]);

    useEffect(() => {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/papaparse/5.3.2/papaparse.min.js';
        script.async = true;
        script.onload = () => setIsScriptLoaded(true);
        document.body.appendChild(script);
        return () => { document.body.removeChild(script); };
    }, []);
    
    useEffect(() => {
        if (!isScriptLoaded) return;
        
        window.Papa.parse('/train_clean.csv', {
            download: true, header: true, dynamicTyping: true,
            complete: (results) => {
                const allData = results.data.filter(row => row && row.Id);
                
                const mapSample = [];
                const mapSampleSize = 2000;
                const mapStep = Math.max(1, Math.floor(allData.length / mapSampleSize));
                for (let i = 0; i < allData.length && mapSample.length < mapSampleSize; i += mapStep) {
                    mapSample.push(allData[i]);
                }
                setMapData(mapSample);
            },
            error: (err) => {
                console.error("Error parsing CSV:", err);
            }
        });
    }, [isScriptLoaded]);
    
    const clearPredictionHistory = () => {
        setPredictionHistory([]);
    };

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        for (const feature of formFeatures) {
            if (formData[feature.name] === undefined || formData[feature.name] === '') {
                setError(`Please fill in the '${feature.label}' field.`);
                return;
            }
        }
        setIsLoading(true);
        setPrediction(null);
        setProbabilities([]);
        setError('');
        setShowMap(false);

        try {
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const numericFormData = Object.fromEntries(Object.entries(formData).map(([key, value]) => [key, Number(value)]));
            for (let i = 1; i <= 40; i++) {
                const key = `Soil_Type${i}`;
                numericFormData[key] = (formData.Soil_Type === key) ? 1 : 0;
            }
            delete numericFormData.Soil_Type;
            
            // --- SIMULATED API RESPONSE ---
            const coverTypes = ['Spruce/Fir', 'Lodgepole Pine', 'Ponderosa Pine', 'Cottonwood/Willow', 'Aspen', 'Douglas-fir', 'Krummholz'];
            const predictionIndex = numericFormData.Elevation % coverTypes.length;
            const predictedClass = coverTypes[predictionIndex];
            
            const simulatedProbs = coverTypes.map(type => ({ type: type, probability: Math.random() * 0.1 }));
            const predictedIndexInProbs = simulatedProbs.findIndex(p => p.type === predictedClass);
            simulatedProbs[predictedIndexInProbs].probability = 0.6 + Math.random() * 0.3;
            const totalProb = simulatedProbs.reduce((sum, p) => sum + p.probability, 0);
            const finalProbabilities = simulatedProbs.map(p => ({...p, probability: p.probability / totalProb}));
            const response = { data: { prediction: predictedClass, probabilities: finalProbabilities }};
            // --- END SIMULATION ---
            
            if (response.data.error) {
                setError(response.data.error);
            } else {
                setPrediction(response.data.prediction);
                setProbabilities(response.data.probabilities);
                setPredictionHistory(prev => [response.data.prediction, ...prev]);
            }
        } catch (err) {
            console.error("API Error:", err);
            setError('Failed to connect to the prediction server.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen text-gray-800 antialiased font-inter bg-gray-50">
            <div className="relative z-10 p-4 lg:p-8">
                <div className="w-full max-w-7xl mx-auto">
                    {/* --- Top Section: Inputs and Prediction --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        {/* Left Column: Branding and Results */}
                        <div className="flex flex-col justify-center animate-fade-in-up">
                            <div className="text-center lg:text-left">
                               <EcoSimLogo />
                                <p className="text-lg text-gray-500 mt-3 max-w-md mx-auto lg:mx-0">
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

                        {/* Right Column: Form */}
                        <div className="flex flex-col justify-center">
                            <main className="bg-white p-8 rounded-xl shadow-lg border border-gray-200 w-full">
                                <div className="mb-6">
                                    <h2 className="text-2xl font-bold font-manrope text-gray-700">Input Parameters</h2>
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    {formFeatures.map((feature, index) => (
                                        <FeatureInput
                                            key={feature.name}
                                            label={feature.label}
                                            name={feature.name}
                                            value={formData[feature.name]}
                                            onChange={handleChange}
                                            helpText={feature.helpText}
                                            delay={index}
                                        />
                                    ))}
                                    <div className="relative animate-fade-in-up sm:col-span-2" style={{ animationDelay: `${formFeatures.length * 50}ms`}}>
                                        <label htmlFor="Soil_Type" className="absolute -top-2 left-2 inline-block bg-white px-1 text-xs font-medium text-gray-500">Soil Type</label>
                                        <div className="relative">
                                            <select
                                                id="Soil_Type"
                                                name="Soil_Type"
                                                value={formData.Soil_Type}
                                                onChange={handleChange}
                                                className="appearance-none block w-full rounded-md border-2 border-gray-300 bg-transparent py-2.5 px-3 text-gray-800 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm transition"
                                            >
                                                {Object.entries(soilTypes).map(([key, fullDescription]) => (
                                                    <option key={key} value={key} title={fullDescription}>
                                                        {soilTypeShortLabels[key]}
                                                    </option>
                                                ))}
                                            </select>
                                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                                                <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 text-center">
                                    <button
                                        type="button"
                                        onClick={handleSubmit}
                                        disabled={isLoading}
                                        className="relative w-full sm:w-auto inline-flex items-center justify-center px-10 py-3 font-medium text-white transition-all duration-300 ease-out bg-green-600 border-2 border-green-600 rounded-lg shadow-md group disabled:opacity-50 disabled:cursor-not-allowed hover:bg-green-700 hover:border-green-700 active:scale-95"
                                    >
                                        <span className="relative flex items-center">
                                            {isLoading ? <LoadingSpinner /> : 'Predict Cover Type'}
                                        </span>
                                    </button>
                                    {error && <p className="text-red-500 font-medium text-center mt-4 text-sm">{error}</p>}
                                </div>
                            </main>
                        </div>
                    </div>

                    {/* --- Bottom Section: Charts and Map --- */}
                    <div className="mt-12">
                         {showMap && <div className="mb-8"><ForestMap data={mapData} /></div>}

                        {(probabilities.length > 0 || predictionHistory.length > 0) && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                                {probabilities.length > 0 && <ProbabilityChart probabilities={probabilities} />}
                                {predictionHistory.length > 0 && <HistoryGraph history={predictionHistory} onClear={clearPredictionHistory} />}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
