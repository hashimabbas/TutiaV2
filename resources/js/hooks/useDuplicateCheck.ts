import axios from 'axios'; // Import Axios
import { debounce } from 'lodash';
import { useCallback, useState } from 'react';
import { route } from 'ziggy-js';

interface DuplicateResult {
    id: number;
    name: string;
    matches: string[];
}

interface Attributes {
    name?: string;
    email?: string;
    website?: string;
    phone?: string;
    first_name?: string;
    last_name?: string;
}

export const useDuplicateCheck = (
    model: 'company' | 'contact',
    currentId?: number,
) => {
    const [duplicates, setDuplicates] = useState<DuplicateResult[]>([]);
    const [isChecking, setIsChecking] = useState(false);

    // Debounced function for calling the API
    const checkApi = useCallback(
        debounce(async (attributes: Attributes) => {
            // Only run check if at least one key field is present and not empty
            const hasKeyField = Object.values(attributes).some(
                (v) => v && v.trim().length > 0,
            );

            if (!hasKeyField) {
                setDuplicates([]);
                setIsChecking(false);
                return;
            }

            setIsChecking(true);

            try {
                // CORRECT: Use axios.post instead of router.post
                // Axios handles the X-CSRF-TOKEN automatically in standard Laravel setups
                const response = await axios.post(
                    route('api.duplicate.check'),
                    {
                        model,
                        id: currentId,
                        attributes,
                    },
                );

                // The controller returns { duplicates: [...] }
                setDuplicates(response.data.duplicates || []);
            } catch (error) {
                console.error('Duplicate check failed:', error);
                setDuplicates([]);
            } finally {
                setIsChecking(false);
            }
        }, 500),
        [model, currentId],
    );

    const checkDuplicates = (attributes: Attributes) => {
        checkApi(attributes);
    };

    return { duplicates, isChecking, checkDuplicates };
};
