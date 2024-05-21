import ua from "user-agents";

const genIp = () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.');

const generateRandomIps = (count: number) => Array.from({ length: count }, () => Array.from({ length: 4 }, () => Math.floor(Math.random() * 256)).join('.')).join(', ')

const genUserAgent = () => new ua().toString().replace(/\/[^/]* (?=[^ ]*$)/, `/${genIp()} `)

export const genRandomHeader = () => ({
    "User-Agent": genUserAgent(),
    // "X-Forwarded-For": generateRandomIps(100),
    "Host": 'www.seedtracker.org',
    "Origin": 'https://seedtracker.org',
    "Cookie": 'domain=seedtracker.org; path=/',

    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Connection': 'keep-alive'
})