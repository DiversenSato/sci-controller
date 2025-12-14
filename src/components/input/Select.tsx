import React, { useMemo } from 'react';

export default function Select<T>({ ID, onSelect, values }: { ID?: string, onSelect: (v: T) => void, values: [string, T][] }) {
    const valuesWithID = useMemo(() => {
        return values.map(([label, value]) => [crypto.randomUUID(), label, value] as [string, string, T]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [values.map(([label]) => label).join('')]);  // Only create new random uuids if labels change and not when array reference changes

    function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const [, , value] = valuesWithID.find(([ID]) => e.target.value === ID)!;
        onSelect(value);
    }

    return (
        <select onChange={handleChange} id={ID}>
            {valuesWithID.map(([ID, label]) =>
                <option value={ID} key={ID}>{label}</option>,
            )}
        </select>
    );
}
