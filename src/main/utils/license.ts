import * as os from 'os';
import * as crypto from 'crypto';

export async function getSystemFingerprint(): Promise<string> {
  const data = [
    os.platform(),
    os.arch(),
    os.hostname(),
    os.cpus()[0]?.model || 'unknown',
    os.networkInterfaces()?.eth0?.[0]?.mac || 
    Object.values(os.networkInterfaces())
      .flat()
      .find(i => i && !i.internal)?.mac || 'unknown'
  ].join('-');

  return crypto.createHash('sha256').update(data).digest('hex').substring(0, 32);
}
