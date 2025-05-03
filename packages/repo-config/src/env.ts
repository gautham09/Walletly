import * as dotenv from 'dotenv';
import path from 'path';


dotenv.config({ path: path.resolve(__dirname, '../.env') }); const BANK_WEBHOOK_SECRET = process.env.BANK_WEBHOOK_SECRET!;
export default BANK_WEBHOOK_SECRET;
