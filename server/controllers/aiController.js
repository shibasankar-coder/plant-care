const axios = require('axios');

// Helper to get detailed care data from Perenual API
const getPerenualCareData = async (scientificName, commonName) => {
    const apiKey = process.env.PERENUAL_API_KEY;
    if (!apiKey || apiKey === 'your_perenual_api_key_here') return null;

    try {
        // 1. Search for the species using scientific name (more accurate)
        const searchRes = await axios.get(`https://perenual.com/api/species-list?key=${apiKey}&q=${encodeURIComponent(scientificName)}`);
        let species = searchRes.data.data?.[0];

        // If not found by scientific name, try common name
        if (!species && commonName) {
            const searchResCommon = await axios.get(`https://perenual.com/api/species-list?key=${apiKey}&q=${encodeURIComponent(commonName)}`);
            species = searchResCommon.data.data?.[0];
        }

        if (!species) return null;

        // 2. Get detailed species info
        const detailsRes = await axios.get(`https://perenual.com/api/species/details/${species.id}?key=${apiKey}`);
        const details = detailsRes.data;

        // 3. Extract watering frequency
        let wateringFrequency = 7; // Default
        if (details.watering_general_benchmark?.value) {
            const match = details.watering_general_benchmark.value.match(/\d+/);
            if (match) wateringFrequency = parseInt(match[0]);
        } else if (details.watering) {
            const w = details.watering.toLowerCase();
            if (w.includes('frequent')) wateringFrequency = 3;
            else if (w.includes('average')) wateringFrequency = 7;
            else if (w.includes('minimum')) wateringFrequency = 14;
        }

        // 4. Extract fertilization frequency (if present)
        let fertilizeFrequency = 30; // Default
        const fertText = (details.fertilizer || '').toLowerCase();
        if (fertText.includes('week')) fertilizeFrequency = 7;
        else if (fertText.includes('bi-weekly') || fertText.includes('2 weeks')) fertilizeFrequency = 14;
        else if (fertText.includes('month')) fertilizeFrequency = 30;

        // 5. Repotting frequency
        let repotFrequency = 365; // Default
        if (details.cycle?.toLowerCase().includes('annual')) {
            repotFrequency = 0;
        }

        // 6. Fetch Care Tips (Sections)
        let careTips = "";
        try {
            const careRes = await axios.get(`https://perenual.com/api/species-care-guide-list?key=${apiKey}&species_id=${species.id}`);
            const sections = careRes.data.data?.[0]?.section;
            if (sections && Array.isArray(sections)) {
                careTips = sections
                    .map(s => `${s.type.toUpperCase()}: ${s.description}`)
                    .join('\n\n');
            }
        } catch (e) {
            console.error('Care Guide Fetch Error:', e.message);
        }

        return {
            wateringFrequency,
            fertilizeFrequency,
            repotFrequency,
            careTips,
            commonName: details.common_name || commonName,
            type: details.type || details.taxonomy?.class || 'Houseplant'
        };

    } catch (error) {
        console.error('Perenual API Data Fetch Error:', error.message);
        return null;
    }
};

// @desc    Identify plant from image (Hybrid: Plant.id for ID, Perenual for Care)
// @route   POST /api/ai/identify
// @access  Private
const identifyPlant = async (req, res) => {
    try {
        const { image } = req.body;

        if (!image) {
            return res.status(400).json({ message: 'Please provide an image' });
        }

        const plantIdKey = process.env.PLANT_ID_API_KEY;

        if (!plantIdKey || plantIdKey === 'your_plant_id_api_key_here') {
            return res.status(500).json({ message: 'Plant.id API key is not configured.' });
        }

        const base64Image = image.includes(',') ? image.split(',')[1] : image;

        // Step 1: Identify using Plant.id (v2)
        const idResponse = await axios.post('https://api.plant.id/v2/identify', {
            api_key: plantIdKey,
            images: [base64Image],
            modifiers: ['crops_fast'],
            plant_details: ['common_names', 'taxonomy', 'watering'],
        });

        const suggestion = idResponse.data.suggestions?.[0];

        if (!suggestion) {
            return res.status(404).json({ message: 'Could not identify this plant.' });
        }

        const scientificName = suggestion.plant_name;
        const plantIdCommonName = suggestion.plant_details?.common_names?.[0] || scientificName;

        // Step 2: Try to get better care data from Perenual
        const perenualData = await getPerenualCareData(scientificName, plantIdCommonName);

        let result;

        if (perenualData) {
            // Use Perenual's professional care data
            result = {
                plantName: perenualData.commonName,
                plantType: perenualData.type,
                wateringFrequency: perenualData.wateringFrequency,
                fertilizeFrequency: perenualData.fertilizeFrequency,
                repotFrequency: perenualData.repotFrequency,
                careTips: perenualData.careTips,
                source: 'Perenual Expert Care Guide'
            };
        } else {
            // Fallback to Plant.id + Heuristics if Perenual has no data
            let wateringFreq = 7;
            const wInfo = suggestion.plant_details?.watering;
            if (wInfo) {
                if (wInfo.max === 1) wateringFreq = 3;
                else if (wInfo.max === 2) wateringFreq = 7;
                else if (wInfo.max === 3) wateringFreq = 14;
            }

            const searchName = (plantIdCommonName + " " + scientificName).toLowerCase();
            let repotFreq = 365;
            let fertFreq = 30;
            let fallbackTips = `Identify Result: ${plantIdCommonName}\n\nThis plant has been identified with high probability. Please ensure it gets appropriate sunlight and regular checkups.`;

            if (searchName.includes('sunflower') || searchName.includes('tomato') || searchName.includes('herb')) {
                repotFreq = 0;
                wateringFreq = searchName.includes('herb') ? 3 : 2;
                fallbackTips += "\n\nNote: This appears to be an annual or herb. Repotting tracking is disabled as they are usually grown in their final spot.";
            } else if (searchName.includes('cactus') || searchName.includes('succulent')) {
                wateringFreq = 14;
                repotFreq = 730;
                fallbackTips += "\n\nNote: Cacti and succulents prefer well-draining soil and infrequent watering.";
            }

            result = {
                plantName: plantIdCommonName,
                plantType: suggestion.plant_details?.taxonomy?.class || 'Houseplant',
                wateringFrequency: wateringFreq,
                fertilizeFrequency: fertFreq,
                repotFrequency: repotFreq,
                careTips: fallbackTips,
                source: 'Plant.id Heuristics'
            };
        }


        res.json({
            ...result,
            probability: (suggestion.probability * 100).toFixed(1) + '%',
        });

    } catch (error) {
        console.error('AI Identification Error:', error.response?.data || error.message);
        res.status(500).json({ message: 'Error processing AI identification' });
    }
};

module.exports = { identifyPlant };
