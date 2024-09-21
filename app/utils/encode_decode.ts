const BASE62_ALPHABET = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';

// Base62编码
function base62Encode(num: number): string {
    if (num === 0) {
        return BASE62_ALPHABET[0];
    }
    let base62 = '';
    while (num > 0) {
        const rem = num % 62;
        base62 = BASE62_ALPHABET[rem] + base62;
        num = Math.floor(num / 62);
    }
    return base62;
}

// Base62解码
function base62Decode(encoded: string): number {
    let num = 0;
    for (let i = 0; i < encoded.length; i++) {
        num = num * 62 + BASE62_ALPHABET.indexOf(encoded[i]);
    }
    return num;
}

// 混淆用户ID（通过异或操作）
function obfuscateUserId(userId: number, key: number): number {
    return userId ^ key;
}

// 生成校验位（使用更复杂的哈希算法）
function generateChecksum(obfuscatedId: number): number {
    // 使用更复杂的校验算法，例如对 obfuscated_id 进行多次哈希或取模
    return (obfuscatedId * 31 + 7) % 238328; // 238328 = 62^3，生成三位校验码
}

// 生成邀请码
export default function generateInviteCode(userId: number, key: number = 73939133): string {
    // 混淆用户ID
    const obfuscatedId = obfuscateUserId(userId, key);
    
    // 生成校验位
    const checksum = generateChecksum(obfuscatedId);
    
    // 将混淆后的ID进行Base62编码
    const base62Encoded = base62Encode(obfuscatedId);
    
    // 将校验位转换为Base62编码（三位校验码）
    const checksumEncoded = base62Encode(checksum).padStart(3, '0'); // 确保校验码是三位
    
    // 将校验位添加到编码后的字符串末尾
    const inviteCode = base62Encoded + checksumEncoded;
    
    // 确保邀请码长度不超过10个字符
    return inviteCode.slice(0, 10);
}

// 解码邀请码
function decodeInviteCode(inviteCode: string, key: number): number {
    // 提取校验位（最后三位）
    const checksumEncoded = inviteCode.slice(-3);
    const checksum = base62Decode(checksumEncoded);
    
    // 提取Base62编码的部分（前面的部分）
    const base62Encoded = inviteCode.slice(0, -3);
    
    // 解码Base62
    const obfuscatedId = base62Decode(base62Encoded);
    
    // 校验校验位是否正确
    if (generateChecksum(obfuscatedId) !== checksum) {
        throw new Error('Invalid invite code: checksum mismatch');
    }
    
    // 反混淆用户ID
    const userId = obfuscateUserId(obfuscatedId, key);
    
    return userId;
}

// 示例密钥
const key = 73939133;

// 生成邀请码
const userId = 12345;
const inviteCode = generateInviteCode(userId, key);
console.log(`生成的邀请码: ${inviteCode}`);

// 解码邀请码
const decodedUserId = decodeInviteCode(inviteCode, key);
console.log(`解码后得到的用户ID: ${decodedUserId}`);
