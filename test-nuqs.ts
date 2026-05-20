import { parseAsString, parseAsInteger } from 'nuqs';

console.log('parseAsString type:', typeof parseAsString);
console.log('parseAsString keys:', Object.keys(parseAsString || {}));
console.log('parseAsString.withDefault type:', typeof (parseAsString as any).withDefault);

console.log('parseAsInteger type:', typeof parseAsInteger);
console.log('parseAsInteger keys:', Object.keys(parseAsInteger || {}));
console.log('parseAsInteger.withDefault type:', typeof (parseAsInteger as any).withDefault);
