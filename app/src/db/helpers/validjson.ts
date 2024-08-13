export default function extractValidJSON(input : string) {
    const jsonStartIndex = input.indexOf('{');
    const jsonEndIndex = input.lastIndexOf('}') + 1;
    
    if (jsonStartIndex !== -1 && jsonEndIndex !== -1) {
        const jsonString = input.slice(jsonStartIndex, jsonEndIndex);
        try {
            const jsonObject = JSON.parse(jsonString);
            return jsonObject;
        } catch (e) {
            console.error('Invalid JSON:', e);
            return null;
        }
    } else {
        console.error('No JSON found in the input string');
        return null;
    }
}