// resources/js/components/SearchableCombobox.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { Check, ChevronsUpDown, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useFormContext } from 'react-hook-form'; // To integrate with react-hook-form
import { debounce } from 'lodash';
import { route } from 'ziggy-js';

// Define a general type for search results
interface SearchResult {
    id: number | string;
    name: string;
    // Add other fields you might need (e.g., company_id for contact filtering)
}

interface SearchableComboboxProps {
    apiRouteName: string; // e.g., 'api.search.companies'
    placeholder: string;
    formFieldName: string;
    // Optional: Pass an existing value object if the field is pre-filled on edit
    initialValue?: { id: number | string, name: string } | null;
    disabled?: boolean;
    onSelect?: (value: number | string | null) => void;
}

const SearchableCombobox: React.FC<SearchableComboboxProps> = ({
    apiRouteName,
    placeholder,
    formFieldName,
    initialValue = null,
    disabled = false,
    onSelect,
}) => {
    const [open, setOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedValue, setSelectedValue] = useState<SearchResult | null>(null);

    // Integrate with react-hook-form context
    const { setValue, watch } = useFormContext();
    const currentFormValue = watch(formFieldName); // The ID stored in the form (number/string)

    // Set initial value on mount
    useEffect(() => {
        if (initialValue && !selectedValue) {
            setSelectedValue(initialValue);
        }
    }, [initialValue, selectedValue]);

    // --- API Fetch Logic ---
    const fetchResults = useCallback(debounce((query: string) => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        setIsLoading(true);
        const url = route(apiRouteName, { q: query });

        fetch(url) // Requires polyfills or setup if using non-standard fetch (e.g. Axios)
            .then(res => res.json())
            .then(data => {
                setResults(data);
            })
            .catch(error => {
                console.error("Search failed:", error);
                setResults([]);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, 300), [apiRouteName]);

    // Trigger API call when search term changes
    useEffect(() => {
        fetchResults(searchTerm);
        return () => fetchResults.cancel();
    }, [searchTerm, fetchResults]);

    // --- Selection Handler ---
    const handleSelect = (result: SearchResult) => {
        const valueToSet = result.id;
        const newName = result.name;

        // 1. Update react-hook-form value (the ID)
        setValue(formFieldName, String(valueToSet), { shouldValidate: true, shouldDirty: true });

        // 2. Update local state for display (the name/object)
        setSelectedValue(result);

        // 3. Close combobox and clear search term
        setOpen(false);
        setSearchTerm('');
        setResults([]);

        // 4. Run optional callback
        if (onSelect) {
            onSelect(valueToSet);
        }
    };

    // --- Clear/Unassign Handler ---
    const handleClear = () => {
        setValue(formFieldName, '', { shouldValidate: true, shouldDirty: true }); // Reset RHF to empty string/null
        setSelectedValue(null);
        setOpen(false);
        if (onSelect) {
            onSelect(null);
        }
    }


    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="outline"
                    role="combobox"
                    disabled={disabled}
                    aria-expanded={open}
                    className="w-full justify-between"
                >
                    {selectedValue ? (
                        <span className="truncate">{selectedValue.name}</span>
                    ) : (
                        <span className="text-muted-foreground">{placeholder}</span>
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[--radix-popover-trigger-width] p-0">
                <Command>
                    <CommandInput
                        placeholder={`Search ${placeholder.toLowerCase()}...`}
                        value={searchTerm}
                        onValueChange={setSearchTerm}
                        disabled={isLoading}
                    />
                    <CommandList>
                        {isLoading && (
                            <div className="flex justify-center items-center py-2">
                                <Loader2 className="h-5 w-5 animate-spin" />
                            </div>
                        )}
                        {!isLoading && results.length === 0 && searchTerm.length >= 2 && (
                            <CommandEmpty>No results found for "{searchTerm}".</CommandEmpty>
                        )}
                        {!isLoading && results.length > 0 && (
                            <CommandGroup>
                                <CommandItem key="clear" onSelect={handleClear}>
                                    <Check className="mr-2 h-4 w-4 opacity-0" />
                                    <span className="italic">-- Clear/Unassign --</span>
                                </CommandItem>
                                {results.map((result) => (
                                    <CommandItem
                                        key={result.id}
                                        value={result.name}
                                        onSelect={() => handleSelect(result)}
                                    >
                                        <Check
                                            className={cn(
                                                "mr-2 h-4 w-4",
                                                currentFormValue && String(result.id) === String(currentFormValue) ? "opacity-100" : "opacity-0"
                                            )}
                                        />
                                        {result.name}
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        )}
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    );
};

export default SearchableCombobox;
